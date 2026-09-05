'use client';

import { IoTrash, IoClose } from 'react-icons/io5';
import { useHistorialReservaciones } from '../hooks/useHistorialReservaciones';
import { getReservacionEstado } from '../types';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import { useState } from 'react';
import type { Reservacion } from '../types';

const ESTADO_STYLES: Record<string, { background: string; color: string }> = {
    Activa: { background: '#d1fae5', color: '#065f46' },
    Completada: { background: '#dbeafe', color: '#1e40af' },
    Cancelada: { background: '#f3f4f6', color: '#6b7280' },
    Expirada: { background: '#fee2e2', color: '#991b1b' },
};

interface HistorialReservacionesProps {
    reservaciones: Reservacion[];
    semanaActual: Date;
    onRefetch: () => void;
    isAdmin: boolean;
}

export function HistorialReservaciones({ reservaciones, semanaActual, onRefetch, isAdmin }: HistorialReservacionesProps) {
    const {
        pestana, 
        setPestana,
        reservacionesSemana, 
        historial,
        loadingId, 
        handleCancelar, 
        handleEliminar,
    } = useHistorialReservaciones(reservaciones, semanaActual, onRefetch);

    const [confirmCancel, setConfirmCancel] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const lista = pestana === 'semana' ? reservacionesSemana : historial;

    const ReservacionRow = ({ r }: { r: Reservacion }) => {
        const estado = getReservacionEstado(r);
        const style  = ESTADO_STYLES[estado];
        const isActive = estado === 'Activa';

        return (
            <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 1rem',borderBottom:'1px solid #f5f5f5',gap:'1rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a', margin: 0 }}>
                        Isla #{r.isla_detalles.numero_isla}
                    </p>
                    <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#888', margin: 0 }}>
                        {r.alumno.first_name} {r.alumno.last_name} · {r.fecha_reserva} · {r.hora_inicio.slice(0,5)}h · {r.duracion_horas}h
                    </p>
                </div>

                <span style={{ ...style,fontFamily:'Poppins',fontSize:'0.72rem',fontWeight:600,borderRadius:'20px',padding:'0.2rem 0.6rem',whiteSpace:'nowrap',flexShrink:0 }}>
                    {estado}
                </span>

                {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                        {isActive && (
                            <button
                                onClick={() => setConfirmCancel(r.id)}
                                disabled={loadingId === r.id}
                                title="Cancelar reservación"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                            >
                                <IoClose size={16} color="#f97316" />
                            </button>
                        )}
                        <button 
                            onClick={() => setConfirmDelete(r.id)}
                            disabled={loadingId === r.id}
                            title="Eliminar del historial"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        >
                            <IoTrash size={16} color="#e53e6d" />
                        </button>
                    </div>    
                )}
            </div>
        );
    };

    return (
<>
            <div style={{ background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'16px',boxShadow:'var(--shadow)',marginTop:'1.5rem',overflow:'hidden', width:'100%' }}>

                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                    {(['semana', 'historial'] as const).map((p) => (

                        <button
                            key={p}
                            onClick={() => setPestana(p)}
                            style={{ flex:1,padding:'0.875rem',fontFamily:'Poppins',fontWeight:pestana === p ? 600 : 400,fontSize:'0.875rem',color:pestana === p ? '#e53e6d' : '#888',background:'none',border:'none',borderBottom:pestana === p ? '2px solid #e53e6d' : '2px solid transparent',cursor:'pointer',transition:'all 0.15s',textTransform:'capitalize'}}
                        >
                            {p === 'semana' ? 'Esta semana' : 'Historial completo'}
                        </button>
                    ))}
                </div>

                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    {lista.length === 0 ? (
                        <p style={{ fontFamily: 'Poppins', color: '#aaa', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
                            No hay reservaciones {pestana === 'semana' ? 'esta semana' : 'en el historial'}.
                        </p>
                    ) : (
                        lista.map((r) => <div key={r.id} className="historial-row" style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 1rem',borderBottom:'1px solid #f5f5f5',gap:'1rem' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a', margin: 0 }}>
                                    Isla #{r.isla_detalles.numero_isla}
                                </p>
                                <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: '#888', margin: 0 }}>
                                    {r.alumno.first_name} {r.alumno.last_name} · {r.fecha_reserva} · {r.hora_inicio.slice(0,5)}h · {r.duracion_horas}h
                                </p>
                            </div>

                            {(() => {
                                const estado = getReservacionEstado(r);
                                const style = ESTADO_STYLES[estado];
                                const isActive = estado === 'Activa';

                                return (
                                    <>
                                        <span style={{ ...style,fontFamily:'Poppins',fontSize:'0.72rem',fontWeight:600,borderRadius:'20px',padding:'0.2rem 0.6rem',whiteSpace:'nowrap',flexShrink:0 }}>
                                            {estado}
                                        </span>

                                        {isAdmin && (
                                            <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                                                {isActive && (
                                                    <button
                                                        onClick={() => setConfirmCancel(r.id)}
                                                        disabled={loadingId === r.id}
                                                        title="Cancelar reservación"
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                                    >
                                                        <IoClose size={16} color="#f97316" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setConfirmDelete(r.id)}
                                                    disabled={loadingId === r.id}
                                                    title="Eliminar del historial"
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                                                >
                                                    <IoTrash size={16} color="#e53e6d" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>)
                    )}
                </div>
            </div>

            <ConfirmModal
                open={confirmCancel !== null}
                title="Cancelar reservación"
                message="¿Estás seguro de que deseas cancelar esta reservación? El alumno será notificado y la isla quedará disponible."
                confirmLabel="Sí, cancelar"
                onClose={() => setConfirmCancel(null)}
                onConfirm={async () => {
                    if (confirmCancel !== null) {
                        await handleCancelar(confirmCancel);
                        setConfirmCancel(null);
                    }
                }}
            />

            <ConfirmModal
                open={confirmDelete !== null}
                title="Eliminar reservación"
                message="¿Deseas eliminar permanentemente este registro del historial? Esta acción no se puede deshacer."
                confirmLabel="Sí, eliminar"
                onClose={() => setConfirmDelete(null)}
                onConfirm={async () => {
                    if (confirmDelete !== null) {
                        await handleEliminar(confirmDelete);
                        setConfirmDelete(null);
                    }
                }}
            />
        </>
    );
}