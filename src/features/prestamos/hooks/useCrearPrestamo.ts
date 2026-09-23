'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { prestamoService } from '../services/prestamoService';
import { inventarioService } from '@/features/inventario';
import { TOKEN_KEYS } from '@/constants';
import { ROLE_BASE_PATH, getSessionRole } from '@/utils/session';
import { adjustMaterialStock } from '../utils/stockSync';
import type { Material } from '@/features/inventario/types';
import type { SelectedMaterial } from '../types';

interface UserInfo {
    name: string;
    username: string;
    role: string;
}

export function useCrearPrestamo() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<UserInfo>({
        name: '',
        username: '',
        role: '',
    });

    const [materials,setMaterials] = useState<Material[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(true);
    const [selected, setSelected] = useState<Record<number, SelectedMaterial>>({});
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 6;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const now = new Date();
    const fecha = `${String(now.getDate()).padStart(2,'0')} / ${String(now.getMonth()+1).padStart(2,'0')} / ${String(now.getFullYear()).slice(-2)}`;
    const hora = now.toTimeString().slice(0, 8);

    useEffect(() => {
        setUserInfo({
            name: localStorage.getItem(TOKEN_KEYS.name)  ?? '',
            username: localStorage.getItem(TOKEN_KEYS.name)  ?? '',
            role: localStorage.getItem(TOKEN_KEYS.role)  ?? '',
        });

        async function fetchMaterials() {
            try {
                const data = await inventarioService.getAll();
                setMaterials(data.filter((m) => m.status === 'Disponible' && m.quantity > 0));
            } catch (err) {
                setError('Error al cargar materiales');
            } finally {
                setLoadingMaterials(false);
            }
        }

        fetchMaterials();
    }, []);

    const paginatedMaterials = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return materials.slice(start, start + PAGE_SIZE);
    }, [materials, page]);

    const totalPages = Math.ceil(materials.length / PAGE_SIZE);

    const toggleMaterial = (material: Material) => {
        setSelected((prev) => {
            if (prev[material.id]) {
                const next = { ...prev };
                delete next[material.id];
            return next;
            }
        
            return {
                ...prev,
                [material.id]: {
                    material_id: material.id,
                    name: material.name,
                    quantity: 1,
                    stock: material.quantity,
                },
            };
        });
    };

    const setQuantity = (materialId: number, qty: number) => {
        setSelected((prev) => {
            if (!prev[materialId]) return prev;
            const stock = prev[materialId].stock;
            return {
                ...prev,
                [materialId]: {
                    ...prev[materialId],
                    quantity: Math.min(Math.max(1, qty), stock), 
                },
            };
        });
    };

    const selectedList = Object.values(selected);

    const syncInventoryAfterLoan = async (materialId: number, delta: number) => {
        const updated = await adjustMaterialStock(materialId, delta);
        setMaterials((prev) => prev.map((item) => item.id === materialId ? updated : item));
    };

    const prestamosPath = `${ROLE_BASE_PATH[getSessionRole() ?? 'Administrador']}/prestamos`;

    const handleSubmit = async () => {
        if (selectedList.length === 0) {
            setError('Selecciona al menos un material');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const today = new Date().toISOString().split('T')[0];
            const returnDate = new Date();
            returnDate.setDate(returnDate.getDate() + 7);
            const returnDateStr = returnDate.toISOString().split('T')[0];

            await Promise.all(
                selectedList.map((item) =>
                    prestamoService.create({
                        material: item.material_id,
                        quantity: item.quantity,
                        loan_period_days: 7,
                        loan_date: today,
                        return_date: returnDateStr,
                    })
                )
            );

            const inventoryResults = await Promise.allSettled(
                selectedList.map((item) => syncInventoryAfterLoan(item.material_id, -item.quantity))
            );

            const hadInventoryErrors = inventoryResults.some((result) => result.status === 'rejected');
            if (hadInventoryErrors) {
                setError('Préstamo creado, pero no se pudo actualizar el inventario.');
            }

            window.dispatchEvent(new CustomEvent('inventory:refresh'));
            router.refresh();
            router.push(`${prestamosPath}?updated=${Date.now()}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear préstamo');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => router.push(prestamosPath);

    return {
        userInfo,
        materials: paginatedMaterials,
        loadingMaterials,
        selected,
        selectedList,
        page,
        setPage,
        totalPages,
        fecha,
        hora,
        loading,
        error,
        toggleMaterial,
        setQuantity,
        handleSubmit,
        handleCancel,
    };
}