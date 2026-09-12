'use client';

import { useState, useEffect, useCallback } from "react";
import { reportesService } from "../services/reportesService";
import { useToast } from "@/components/ui/Toast/ToastContext";
import { type LoanHistory, type ConditionReport, PestanaReportes } from "../types";
import type { Reservacion } from "@/features/islas/types";

export function useReportes() {
    const { showToast } = useToast();

    const [ pestana, setPestana ] = useState<PestanaReportes>('prestamos');
    const [ loading, setLoading ] = useState(true);
    const [ search, setSearch ] = useState('');

    const [ historial, setHistorial ] = useState<LoanHistory[]>([]);
    const [ condReportes, setCondReportes ] = useState<ConditionReport[]>([]);
    const [ reservaciones, setReservaciones ] = useState<Reservacion[]>([]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        try{
            const [ hist, reservs, loansWithReport ] = await Promise.all([
                reportesService.getHistorial(),
                reportesService.getReservaciones(),
                reportesService.getLoansWithReport(),
            ]);
            setHistorial(hist);
            setReservaciones(reservs);

            const reportes = await Promise.all( loansWithReport.map((l) => reportesService.getConditionReport(l.id).catch(() => null)));
            setCondReportes(reportes.filter(Boolean) as ConditionReport[]);
        } catch (err) {
            showToast('Error al cargar reportes.', 'error');
        }finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const historialFiltrado = historial.filter((h) => {
        if (!search.trim()) return true;
        const term = search.toLowerCase();
        return (
            h.material_name.toLowerCase().includes(term) || 
            h.requested_by_username.toLowerCase().includes(term) ||
            h.approved_by_username.toLowerCase().includes(term)
        );
    });

    const reservacionesFIltradas = reservaciones.filter((r) => {
        if (!search.trim()) return true;
        const term = search.toLowerCase();
        return(
            r.alumno.first_name.toLowerCase().includes(term) || 
            r.alumno.last_name.toLowerCase().includes(term) ||
            String(r.isla_detalles.numero_isla).includes(term)
        );
    });

    return {
        pestana, setPestana,
        loading,
        search, setSearch,
        historialFiltrado,
        condReportes, 
        reservacionesFIltradas,
        refetch: fetchAll
    };
}
