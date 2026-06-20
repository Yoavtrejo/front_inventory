'use client';

import { dashService } from "../services/dashboardServices";
import { useEffect, useState } from "react";

export interface DashboardStats {
    reservaciones: number;
    islas: number;
    prestamos: number;
    reportes: number;
}

export function useDashboard(){
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        const cargarDatos = async() => {
            try{
                const token = localStorage.getItem('accessToken');
                if (!token){
                    setError('No hay sesión activa');
                    return
                }

                const data = await dashService.getStats(token);
                setStats(data);
        } catch (err){
            setError('Error al encontrar los datos.');
        }finally{
            setLoading(false);
        }
    }
        cargarDatos()
    }, [])

    return {
        stats,
        loading, 
        error
    }
}