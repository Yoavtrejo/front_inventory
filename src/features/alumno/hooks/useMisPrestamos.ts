'use client';

import { useEffect, useState } from 'react';
import { prestamoService } from '@/features/prestamos';
import { inventarioService } from '@/features/inventario';
import type { MaterialLoan } from '@/features/prestamos';

export interface PrestamoResumen {
    loan: MaterialLoan;
    materialName: string;
}

// El backend ya limita /material-loans/ a los préstamos del usuario que no es admin
export function useMisPrestamos() {
    const [prestamos, setPrestamos] = useState<PrestamoResumen[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isActive = true;
        Promise.all([prestamoService.getAll(), inventarioService.getAll()])
            .then(([loans, materials]) => {
                if (!isActive) return;
                setPrestamos(loans.map((loan) => ({
                    loan,
                    materialName: materials.find((material) => material.id === loan.material)?.name ?? `Material ${loan.material}`,
                })));
            })
            .catch(() => {
                if (isActive) setPrestamos([]);
            })
            .finally(() => {
                if (isActive) setLoading(false);
            });
        return () => { isActive = false; };
    }, []);

    return { prestamos, loading };
}
