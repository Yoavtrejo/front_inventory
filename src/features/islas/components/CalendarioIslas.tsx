import { HORAS, DIAS, formatDate, formatSemana, getReservacionesDeSemana, getReservacionEnSlot, getIslasOcupadasEnSlot } from '../utils/calendar';
import { IoChevronBackOutline, IoChevronForwardOutline, IoLockClosedOutline } from 'react-icons/io5';
import type { HorarioBloqueado, Reservacion, Ocupacion, Isla } from '../types';

const ESTADO_COLORS : Record<string, {background: string; color:string }> = {
    Disponible: { background: 'var(--isla-available-bg)', color: 'var(--isla-available-text)' },
    Reservada: { background: 'var(--isla-reserved-bg)', color: 'var(--isla-reserved-text)' },
    Ocupada: { background: 'var(--isla-occupied-bg)', color: 'var(--isla-occupied-text)' },
}

interface CalendarioIslasPropos {
    semanaActual: Date;
    reservaciones: Reservacion[];
    bloqueos: HorarioBloqueado[];
    onAnterior: () => void;
    onSiguiente: () => void;
    onSlotClick: (fecha:string, hora:string) => void;
    onBloqueoClick?: (fecha:string, hora:string) => void;
    isAdmin: boolean;
    // Solo para docente/alumno: reservaciones de otras personas en la semana
    ocupacion?: Ocupacion[];
    islas?: Isla[];
}

export function getBloqueoEnSlot ( bloqueos: HorarioBloqueado[], fecha: string, hora:string ) : HorarioBloqueado | null {
    return bloqueos.find((b) => {
        if (b.fecha !== fecha) return false;
        const horaSlot = `${hora}:00`;
        return b.hora_inicio <= horaSlot && b.hora_fin > horaSlot;
    }) ?? null;
}

export function CalendarioIslas({ semanaActual, reservaciones, bloqueos, onAnterior, onSiguiente, onSlotClick, onBloqueoClick, isAdmin, ocupacion = [], islas = [] } : CalendarioIslasPropos) {
    const numeroIsla = (islaId: number) => islas.find((isla) => isla.id === islaId)?.numero_isla ?? islaId;
    const reservSemana = getReservacionesDeSemana(reservaciones, semanaActual);

    const fechaDias = DIAS.map((_,i) => {
        const d = new Date(
            semanaActual.getFullYear(),
            semanaActual.getMonth(),
            semanaActual.getDate() + i
        )
        return formatDate(d);
    });

    return(
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'1.5rem', boxShadow:'var(--shadow)', overflow:'hidden' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.5rem' }}>
                <button onClick={onAnterior} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.4rem 0.75rem', cursor:'pointer', fontFamily:'Poppins', fontSize:'0.85rem', color:'var(--text-soft)' }}>
                    <IoChevronBackOutline/> Anterior
                </button>

                <div style={{ textAlign:'center', flex:1 }}>
                    <p style={{ fontFamily:'Poppins', fontWeight:600, fontSize:'0.9rem', color:'var(--text)' }}>
                        {formatSemana(semanaActual)}
                    </p>
                    <div style={{ height:'2px', background:'linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end))', borderRadius:'8px', marginTop:'4px' }}/>
                </div>

                <button onClick={onSiguiente} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.4rem 0.75rem', cursor:'pointer', fontFamily:'Poppins', fontSize:'0.85rem', color:'var(--text-soft)' }}>
                    Siguiente <IoChevronForwardOutline/>
                </button>
            </div>

            <div style={{ overflowX: 'auto'}}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'600px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding:'0.5rem', fontFamily:'Poppins', fontSize:'0.78rem', color:'var(--text-muted)',fontWeight:600, textAlign:'left', width:'80px' }}>
                                Hora
                            </th>
                            {DIAS.map((dia) => (
                                <th key={dia} style={{ padding:'0.5rem', fontFamily:'Poppins', fontSize:'0.78rem', color:'var(--text-muted)', fontWeight:600, textAlign:'center', textTransform:'capitalize' }}>
                                    {dia}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {HORAS.map((hora) => (
                            <tr key={hora}>
                                <td style={{ padding:'0.4rem 0.5rem', fontFamily:'Poppins', fontSize:'0.78rem', color:'var(--text-muted)', whiteSpace:'nowrap', borderTop:'1px solid var(--border)' }}>
                                    {hora} a {String(parseInt(hora.slice(0,2), 10) + 1).padStart(2,'0')}:00
                                </td>
                                {fechaDias.map((fecha, i) => {
                                    const reserv = getReservacionEnSlot(reservSemana, fecha, hora);
                                    const bloqueo = getBloqueoEnSlot(bloqueos, fecha, hora);
                                    const ocupadas = getIslasOcupadasEnSlot(ocupacion, fecha, hora);
                                    const todasOcupadas = islas.length > 0 && ocupadas.length >= islas.length;

                                    return(
                                        <td key={fecha} style={{ padding:'0.3rem',  borderTop:'1px solid var(--border)', textAlign:'center' }}>
                                            {bloqueo ? (
                                                <div title={`Bloqueado: ${bloqueo.motivo}`} style={{ height:'28px', borderRadius:'6px', background:'var(--isla-blocked-bg)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'default' }}>
                                                    <span style={{ fontSize:'0.65rem', fontFamily:'Poppins', color:'var(--isla-blocked-text)', fontWeight:600 }}>
                                                        <IoLockClosedOutline/> {bloqueo.motivo.slice(0, 8)}
                                                    </span>
                                                </div>
                                            ) : reserv ? (
                                                <div title={`Isla ${reserv.isla_detalles.numero_isla} - ${reserv.alumno.first_name} ${reserv.alumno.last_name}`} style={{ background:'var(--isla-reserved-bg)', color:'var(--isla-reserved-text)', borderRadius:'6px', padding:'0.25rem 0.4rem', fontSize:'0.75rem', fontFamily:'Poppins', fontWeight:'600', cursor:'default' }}>
                                                    Isla {reserv.isla_detalles.numero_isla}
                                                </div>
                                            ) : ocupadas.length > 0 ? (
                                                <div
                                                    title={`Ocupada: ${ocupadas.map((islaId) => `Isla ${numeroIsla(islaId)}`).join(', ')}`}
                                                    onClick={() => { if (!todasOcupadas) onSlotClick(fecha, hora); }}
                                                    style={{ background:'var(--isla-occupied-bg)', color:'var(--isla-occupied-text)', borderRadius:'6px', padding:'0.25rem 0.4rem', fontSize:'0.72rem', fontFamily:'Poppins', fontWeight:600, cursor: todasOcupadas ? 'not-allowed' : 'pointer' }}
                                                >
                                                    {todasOcupadas ? 'Ocupada' : `${ocupadas.length} ocupada${ocupadas.length > 1 ? 's' : ''}`}
                                                </div>
                                            ) : (
                                                <div 
                                                    onClick={() => isAdmin && onBloqueoClick ? onBloqueoClick(fecha, hora) : onSlotClick(fecha, hora)}
                                                    style={{ height:'28px', borderRadius:'6px', background:'var(--surface-soft)', cursor:'pointer', transition:'background 0.15s'}}
                                                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--isla-available-bg)')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface-soft)')}
                                                />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display:'flex', gap:'1rem', marginTop:'1rem', flexWrap:'wrap' }}>
                { Object.entries(ESTADO_COLORS).filter(([estado]) => !isAdmin || estado !== 'Ocupada').map(([estado, style]) => (
                    <div key={estado} style={{ display:'flex', alignItems:'center', gap:'0.4rem'}}>
                        <div style={{ width:12, height:12, borderRadius:'50%', background: style.background, border:`2px solid ${style.color}`}}/>
                        <span style={{ fontFamily:'Poppins', fontSize:'0.78rem', color:'var(--text-soft)'}}>{estado}</span>
                    </div>
                )) }
            </div>
        </div>
    )
}