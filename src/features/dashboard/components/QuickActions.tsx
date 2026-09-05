'use client';

import { useRouter } from 'next/navigation';
import { IoAddCircleOutline, IoCalendarOutline, IoDocumentTextOutline } from 'react-icons/io5';

export function QuickActions() {
    const router = useRouter();

    const actions = [
        { label: 'Nuevo Préstamo', icon: IoAddCircleOutline, path: '/admin/prestamos/crear' },
        { label: 'Reservar Isla', icon: IoCalendarOutline, path: '/admin/islas' },
        { label: 'Ver Reportes', icon: IoDocumentTextOutline, path: 'admin//inventario' },
    ];

    return (
        <div style={{ background: 'var(--surface)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
                Acciones Rápidas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {actions.map((act) => {
                    const Icon = act.icon;
                    return (
                        <button 
                            key={act.label} 
                            onClick={() => router.push(act.path)}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.75rem', 
                                width: '100%', 
                                padding: '0.75rem 1rem', 
                                background: 'transparent', 
                                border: '1px solid var(--border)', 
                                borderRadius: '10px', 
                                color: 'var(--text)', 
                                cursor: 'pointer', 
                                textAlign: 'left', 
                                fontWeight: 500,
                                transition: 'background 0.2s ease'
                            }}
                        >
                            <Icon size={18} color="#e53e6d" />
                            {act.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}