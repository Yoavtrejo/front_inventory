'use client';

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { prestamoService } from "../services/prestamoService";
import { getLoanStatus } from "../utils/loanStatus";
import { TOKEN_KEYS } from "@/constants";
import { inventarioService } from "@/features/inventario";
import type { MaterialLoan, LoanStatus } from "../types";

type FilterStatus = LoanStatus | 'Todos';

export function usePrestamos(){
    const searchParams = useSearchParams();
    const refreshTrigger = searchParams.get('updated');

    const [loans, setLoans] = useState<MaterialLoan[]>([]);
    const [filtered, setFiltered ] = useState<MaterialLoan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<FilterStatus>('Todos');

    const fetchLoans = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await prestamoService.getAll();
                // Deduplica por id por si acaso
            const unique = Array.from(
            new Map(data.map((loan) => [loan.id, loan])).values()
        );
        setLoans(unique);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar préstamos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans, refreshTrigger]);

    useEffect(() => {
        let result = loans;
        if (filter !== 'Todos'){
            result = result.filter((loan) => getLoanStatus(loan) === filter);
        }

        if(search.trim()){
            const term = search.toLowerCase();
            result = result.filter((loan) =>
                loan.requested_by.first_name.toLowerCase().includes(term) || 
                loan.requested_by.last_name.toLowerCase().includes(term) ||
                loan.requested_by.username.toLowerCase().includes(term) || 
                String(loan.id).includes(term)
            );
        }

        setFiltered(result);
    }, [loans, search, filter]);

    const handleAuthorize = async (loanId: number) => {
        const userId = Number(localStorage.getItem(TOKEN_KEYS.access) ? JSON.parse(atob(localStorage.getItem(TOKEN_KEYS.access)!.split('.')[1])).user_id : 0);

        try{
            const update = await prestamoService.authorize(loanId, userId);
            setLoans((prev)=> prev.map((l) => l.id === loanId ? update : l));
        }catch (err){
            setError(err instanceof Error ? err.message : 'Error al autorizar');
        }
    };

    const handleFinalize = async (loanId: number) => {
        try{
            const updated = await prestamoService.finalize(loanId);
            setLoans((prev) => prev.map((l) => l.id === loanId ? updated : l));

            const material = await inventarioService.getById(updated.material);
            const nextQuantity = material.quantity + updated.quantity;
            const nextStatus = nextQuantity <= 0
                ? 'Agotado'
                : nextQuantity <= material.min_stock
                    ? 'Stock bajo'
                    : material.status;

            await inventarioService.update(updated.material, {
                name: material.name,
                description: material.description,
                quantity: nextQuantity,
                min_stock: material.min_stock,
                max_stock: material.max_stock,
                status: nextStatus,
            });

            window.dispatchEvent(new CustomEvent('inventory:refresh'));
        }catch (err){
            setError(err instanceof Error ? err.message : 'Error al finalizar')
        }
    };

    const handleDelete = async (loanId:number) => {
        try{
            await prestamoService.delete(loanId);
            setLoans((prev) => prev.filter((l) => l.id !== loanId));
        }catch (err){
            setError(err instanceof Error ? err.message : 'Error al eliminar');
        }
    };

    return{
        loans: filtered,
        loading,
        error,
        search, setSearch,
        filter, setFilter,
        refetch: fetchLoans,
        handleAuthorize,
        handleFinalize,
        handleDelete
    };

}