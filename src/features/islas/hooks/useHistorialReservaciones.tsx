'use client';

import { useState, useMemo } from 'react';
import { islasService } from '../services/islasService';
import { getReservacionEstado } from '../types';
import { useToast } from '@/components/ui/Toast/ToastContext';
import type { Reservacion } from '../types';

type Pestana = 'semana' | 'historial';

export function useHistorialReservaciones( reservaciones: Reservacion[], semanaActual: Date, onRefetch: () => void ) {
    const { showToast } = useToast();
    const [pestana, setPestana] = useState<Pestana>('semana');
    const [loadingId, setLoadingId] = useState<number | null>(null);

    const reservacionesSemana = useMemo(() => {
        const lunes = new Date(semanaActual.getFullYear(), semanaActual.getMonth(), semanaActual.getDate());
        const viernes = new Date(semanaActual.getFullYear(), semanaActual.getMonth(), semanaActual.getDate() + 6);
        const lunesStr = `${lunes.getFullYear()}-${String(lunes.getMonth()+1).padStart(2,'0')}-${String(lunes.getDate()).padStart(2,'0')}`;
        const viernesStr = `${viernes.getFullYear()}-${String(viernes.getMonth()+1).padStart(2,'0')}-${String(viernes.getDate()).padStart(2,'0')}`;

        return reservaciones.filter((r) => r.fecha_reserva >= lunesStr && r.fecha_reserva <= viernesStr).sort((a, b) => a.fecha_reserva.localeCompare(b.fecha_reserva));
    }, [reservaciones, semanaActual]);

    const historial = useMemo(() => {
        return [...reservaciones].sort((a, b) => b.fecha_reserva.localeCompare(a.fecha_reserva));
    }, [reservaciones]);

    const handleCancelar = async (id: number) => {
        setLoadingId(id);
        try {
            await islasService.cancelarReservacion(id);
            showToast('Reservación cancelada correctamente', 'success');
            onRefetch();
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Error al cancelar', 'error');
        } finally {
            setLoadingId(null);
        }
    };

    const handleEliminar = async (id: number) => {
        setLoadingId(id);
        try {
            await islasService.deleteReservacion(id);
            showToast('Reservación eliminada', 'success');
            onRefetch();
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Error al eliminar', 'error');
        } finally {
            setLoadingId(null);
        }
    };

    return {
        pestana, 
        setPestana,
        reservacionesSemana,
        historial,
        loadingId,
        handleCancelar,
        handleEliminar,
    };    
}