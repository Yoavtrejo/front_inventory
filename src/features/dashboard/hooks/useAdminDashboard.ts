'use client';

import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { TOKEN_KEYS } from '@/constants';
import type { DashboardData, ActivityItem } from '../types';

export function useAdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const name = localStorage.getItem(TOKEN_KEYS.name) ?? 'Admin';
        setUserName(name);

        async function loadDashboardData() {
            try {
                const [reservaciones, prestamos, islas] = await Promise.all([
                    dashboardService.getReservaciones(),
                    dashboardService.getPrestamos(),
                    dashboardService.getIslas(),
                ]);

                // Cálculo de KPIs
                const islasReservadas = islas.filter((i) => i.estado === 'Reservada').length;
                const prestamosActivos = prestamos.filter((p) => p.approved_by !== null && !p.has_condition_report).length;
                const reservacionesActivas = reservaciones.filter((r) => !r.completada && !r.cancelada).length;
                const reportesCount = prestamos.filter((p) => p.has_condition_report).length;

                // Construcción de Actividad Reciente combinando Reservas y Préstamos
                const reservasActivity: ActivityItem[] = reservaciones.map((r) => ({
                    id: `res-${r.id}`,
                    usuario: `${r.alumno.first_name} ${r.alumno.last_name}`.trim() || r.alumno.username,
                    accion: 'Reserva',
                    detalle: `Isla #${r.isla_detalles?.numero_isla ?? r.isla}`,
                    fecha: r.created_at,
                    estado: r.cancelada ? 'alerta' : r.completada ? 'completado' : 'pendiente'
                }));

                const prestamosActivity: ActivityItem[] = prestamos.map((p) => ({
                    id: `pres-${p.id}`,
                    usuario: `${p.requested_by.first_name} ${p.requested_by.last_name}`.trim() || p.requested_by.username,
                    accion: 'Préstamo',
                    detalle: p.items.map((item) => `${item.quantity} × ${item.material_name}`).join(', '),
                    fecha: p.created_at,
                    estado: p.has_condition_report ? 'alerta' : p.approved_by ? 'completado' : 'pendiente'
                }));

                // Ordenar por fecha descendente y tomar los últimos 5
                const combinedActivity = [...reservasActivity, ...prestamosActivity]
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .slice(0, 5);

                setData({
                    stats: [
                        { label: 'Reservaciones', value: reservacionesActivas, icon: 'calendar' },
                        { label: 'Préstamos', value: prestamosActivos, icon: 'card' },
                        { label: 'Islas reservadas', value: islasReservadas, icon: 'grid' },
                        { label: 'Reportes', value: reportesCount, icon: 'warning' },
                    ],
                });

                setRecentActivity(combinedActivity);

            } catch (err) {
                const mensaje = err instanceof Error ? err.message : 'Error al cargar el dashboard';
                setError(mensaje);
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    return { data, recentActivity, loading, error, userName };
}