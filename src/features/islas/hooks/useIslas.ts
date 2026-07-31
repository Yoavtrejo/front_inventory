'use client';

import { useState, useEffect, useCallback } from "react";
import { islasService } from "../services/islasService";
import type  { Isla, Reservacion, HorarioBloqueado } from '../types';
import { getLunesDeSemana } from "../utils/calendar";


export function useIslas(){
    const [ islas, setIslas ] = useState<Isla[]>([]);
    const [ reservaciones, setReservaciones ] = useState<Reservacion[]>([]);
    const [ bloqueos, setBloqueos ] = useState<HorarioBloqueado[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    const [semanaActual, setSemanaActual] = useState<Date>(() => {
        const hoy = new Date();
        return getLunesDeSemana(new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate()
        ));
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try{
            const [ islaData, reservData, bloqueosData ] = await Promise.all([
                islasService.getAll(),
                islasService.getReservaciones(),
                islasService.getHorariosBloquedos(),
            ]);
            setIslas(islaData);
            setReservaciones(reservData);
            setBloqueos(bloqueosData);
        }catch (err){
            setError(err instanceof Error ? err.message : 'Error al cargar datos.');
        }finally{
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const semanaAnterior = () => {
        setSemanaActual((prev) => new Date(
            prev.getFullYear(),
            prev.getMonth(),
            prev.getDate() - 7
        ));
    };

    const semanaSiguiente = () => {
        setSemanaActual((prev) => new Date(
            prev.getFullYear(),
            prev.getMonth(),
            prev.getDate() + 7
        ));
    };

    const handleDeleteIsla = async (islaId: number) => {
        try{
            await islasService.delete(islaId);
            setIslas((prev) => prev.filter((i) => i.id !== islaId));
        }catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar isla');
        }
    };

    return {
        islas,
        reservaciones,
        bloqueos,
        loading,
        error,
        semanaActual,
        semanaAnterior,
        semanaSiguiente, 
        refetch: fetchData,
        handleDeleteIsla
    }
}