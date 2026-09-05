'use client';

import type { ActivityItem } from '../types';

interface RecentActivityProps {
    items: ActivityItem[];
    loading: boolean;
}

export function RecentActivity({ items, loading }: RecentActivityProps) {
    if (loading) {
        return (
            <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} style={{ height: '52px', borderRadius: '10px', background: 'var(--border)' }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
                Actividad Reciente
            </h3>

            {items.length === 0 ? (
                <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>No hay actividad reciente registrada.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {items.map((item) => (
                        <div 
                            key={item.id} 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                padding: '0.75rem 1rem', 
                                background: 'rgba(255,255,255,0.02)', 
                                borderRadius: '10px', 
                                border: '1px solid var(--border)' 
                            }}
                        >
                            <div>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                                    {item.usuario} <span style={{ fontWeight: 400, color: 'var(--text-soft)' }}>— {item.accion}</span>
                                </p>
                                <small style={{ color: 'var(--text-soft)', fontSize: '0.8rem' }}>{item.detalle}</small>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)', display: 'block', marginBottom: '4px' }}>
                                    {new Date(item.fecha).toLocaleDateString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <Badge estado={item.estado} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function Badge({ estado }: { estado: ActivityItem['estado'] }) {
    const styles = {
        completado: { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', label: 'Completado' },
        pendiente: { bg: 'rgba(234, 179, 8, 0.15)', color: '#eab308', label: 'Pendiente' },
        alerta: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', label: 'Atención' },
    }[estado];

    return (
        <span style={{ background: styles.bg, color: styles.color, padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
            {styles.label}
        </span>
    );
}