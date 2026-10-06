'use client';

import { useCallback, useEffect, useState } from 'react';
import { carrerasService } from '../services/carrerasService';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { Carrera } from '../types';

export function useCarreras() {
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isActive = true;
        carrerasService.getAll()
            .then((data) => { if (isActive) { setCarreras(data); setError(null); } })
            .catch((err: unknown) => { if (isActive) setError(getApiErrorMessage(err, 'No se pudieron cargar las carreras.')); })
            .finally(() => { if (isActive) setLoading(false); });
        return () => { isActive = false; };
    }, [reloadKey]);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return { carreras, loading, error, reload };
}
