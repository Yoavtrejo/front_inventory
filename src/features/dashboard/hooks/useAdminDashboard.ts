'use client';

import { useState, useEffect } from 'react';
import { dashboardService }    from '../services/dashboardService';
import { TOKEN_KEYS }          from '@/constants';
import type { DashboardData }  from '../types';

export function useAdminDashboard() {
    const [data, setData]         = useState<DashboardData | null>(null);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string | null>(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem(TOKEN_KEYS.name) ?? 'Admin';
        setUserName(name);

        async function fetchStats() {
            try {
                const [reservaciones, prestamos, islas] = await Promise.all([
                    dashboardService.getReservaciones(),
                    dashboardService.getPrestamos(),
                    dashboardService.getIslas(),
                ]);

                const islasReservadas = islas.filter(
                    (i) => i.estado === 'Reservada'
                ).length;

                const prestamosActivos = prestamos.filter(
                    (p) => p.approved_by !== null && !p.has_condition_report
                ).length;

                const reservacionesActivas = reservaciones.filter(
                    (r) => !r.completada && !r.cancelada
                ).length;

                setData({
                    stats:[
                        { label: 'Reservaciones', value: reservacionesActivas, icon: 'calendar' },
                        { label: 'Préstamos', value: prestamosActivos, icon: 'card'     },
                        { label: 'Islas reservadas', value: islasReservadas, icon: 'grid'     },
                        { label: 'Reportes', value: 0, icon: 'warning'  },
                    ],
                });

            }catch (err){
                const mensaje = err instanceof Error ? err.message : 'Error al cargar el dashboard';
                setError(mensaje);
            }finally{
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return { data, loading, error, userName};
}