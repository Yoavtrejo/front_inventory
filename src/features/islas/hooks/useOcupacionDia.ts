'use client';

import { useEffect, useState } from 'react';
import { islasService } from '../services/islasService';
import type { Ocupacion } from '../types';

interface OcupacionDelDia {
    fecha: string;
    ocupacion: Ocupacion[];
}

// Ocupación de un día concreto para el modal de reserva (la fecha puede estar fuera de la semana visible)
export function useOcupacionDia(fecha: string | null): Ocupacion[] {
    const [resultado, setResultado] = useState<OcupacionDelDia | null>(null);

    useEffect(() => {
        if (!fecha) return;
        let isActive = true;
        islasService.getOcupacion(fecha, fecha)
            .then((ocupacion) => { if (isActive) setResultado({ fecha, ocupacion }); })
            .catch(() => { if (isActive) setResultado({ fecha, ocupacion: [] }); });
        return () => { isActive = false; };
    }, [fecha]);

    return resultado && resultado.fecha === fecha ? resultado.ocupacion : [];
}
