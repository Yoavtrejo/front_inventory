'use client';

import { useEffect, useState } from 'react';
import { prestamoService } from '@/features/prestamos';
import type { MaterialLoan } from '@/features/prestamos';

// El backend ya limita /material-loans/ a los préstamos del usuario que no es admin
export function useMisPrestamos() {
    const [prestamos, setPrestamos] = useState<MaterialLoan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isActive = true;
        prestamoService.getAll()
            .then((loans) => { if (isActive) setPrestamos(loans); })
            .catch(() => { if (isActive) setPrestamos([]); })
            .finally(() => { if (isActive) setLoading(false); });
        return () => { isActive = false; };
    }, []);

    return { prestamos, loading };
}
