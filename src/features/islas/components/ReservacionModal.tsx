import type { Dispatch, SetStateAction } from "react";
import type { Isla } from "../types";
import { HORAS, formatDate } from "../utils/calendar";

interface ReservacionForm {
    isla_id: number | null;
    duracion_horas: number;
}

type FormErrors = Partial<Record<keyof ReservacionForm, string>>;

interface ReservacionModalProps {
    slot: { fecha: string; hora: string } | null;
    form: ReservacionForm;
    setForm: Dispatch<SetStateAction<ReservacionForm>>;
    formErrors: FormErrors;
    loading: boolean;
    error: string | null;
    islas: Isla[];
    onClose: () => void;
    onSubmit: () => void;
    // Islas ya reservadas en este horario (por cualquier persona)
    islasOcupadas?: number[];
    // Si se pasa, la fecha y la hora se pueden cambiar (botón "Reservar")
    onSlotChange?: (changes: { fecha?: string; hora?: string }) => void;
}

export function ReservacionModal({ slot, form, setForm, formErrors, loading, error, islas, onClose, onSubmit, islasOcupadas = [], onSlotChange} : ReservacionModalProps){
    if (!slot) return null;

    // Isla.estado es global (se marca "Reservada" con cualquier reserva); la disponibilidad real es por horario
    const islasDisponibles = islas.filter((i) => !islasOcupadas.includes(i.id));
    const hoy = formatDate(new Date());

    return(
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}/>
            <div className="modal-card" style={{ borderRadius:'16px', maxWidth:'440px', width:'90%'}}>
                <header className="modal-card-head" style={{ borderRadius:'16px 16px 0 0', background:'#fff', borderBottom:'1px solid #f0f0f0', }}>
                    <p className="modal-card-title" style={{ fontFamily: 'Poppins', fontWeight:600 }}>
                        Reservar Isla
                    </p>
                    <button className="delete" onClick={onClose}/>
                </header>

                <section className="modal-card-body">
                    {onSlotChange ? (
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1rem' }}>
                            <div className="field" style={{ marginBottom:0 }}>
                                <label className="label" style={{ fontFamily:'Poppins', fontSize:'0.875rem' }}>Fecha</label>
                                <input
                                    className="input"
                                    type="date"
                                    min={hoy}
                                    value={slot.fecha}
                                    onChange={(e) => { onSlotChange({ fecha: e.target.value }); setForm((prev) => ({ ...prev, isla_id: null })); }}
                                    style={{ fontFamily:'Poppins', borderRadius:'8px' }}
                                />
                            </div>
                            <div className="field" style={{ marginBottom:0 }}>
                                <label className="label" style={{ fontFamily:'Poppins', fontSize:'0.875rem' }}>Hora inicio</label>
                                <div className="select is-fullwidth">
                                    <select
                                        value={slot.hora}
                                        onChange={(e) => { onSlotChange({ hora: e.target.value }); setForm((prev) => ({ ...prev, isla_id: null })); }}
                                        style={{ fontFamily:'Poppins' }}
                                    >
                                        {HORAS.map((hora) => <option key={hora} value={hora}>{hora}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ background:'#f8f9fa', borderRadius:'8px', padding:'0.75rem 1rem', marginBottom:'1.25rem' }}>
                            <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'#555', margin:0}}>
                                <strong>Fecha:</strong> {slot.fecha}
                            </p>
                            <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'#555', margin:0, marginTop:'0.25rem' }}>
                                <strong>Hora inicio:</strong> {slot.hora}
                            </p>
                        </div>
                    )}

                    <div className="field">
                        <label className="label" style={{ fontFamily:'Poppins', fontSize:'0.875rem' }}>
                            Isla
                        </label>
                        <div className="control">
                            <div className={`select is-fullwidth ${formErrors.isla_id ? 'is-danger' : ''}`}>
                                <select 
                                    value={form.isla_id ?? ''}
                                    onChange={(e) => setForm((prev) => ({...prev, isla_id:Number(e.target.value) || null }))}
                                    style={{ fontFamily:'Poppins'}}
                                >
                                    <option value="">Selecciona una isla</option>
                                    {islasDisponibles.map((isla) => (
                                        <option key={isla.id} value={isla.id}>
                                            Isla #{isla.numero_isla}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {formErrors.isla_id && (
                            <p className="help is-danger" style={{ fontFamily:'Poppins' }}>
                                {formErrors.isla_id}
                            </p>
                        )}
                    </div>

                    <div className="field">
                        <label className="label" style={{ fontFamily:'Poppins', fontSize:'0.875rem'}}>
                            Duración (horas)
                        </label>
                        <div className="control">
                            <input 
                                className={`input ${formErrors.duracion_horas ? 'is-danger' : ''}`}
                                type="number" 
                                min={1}
                                max={4}
                                value={form.duracion_horas}
                                onChange={(e) => setForm((prev) => ({ ...prev, duracion_horas: Number(e.target.value) }))}
                                style={{ fontFamily: 'Poppins', borderRadius:'8px'}}
                            />
                        </div>
                        {formErrors.duracion_horas && (
                            <p className="help is-danger" style={{ fontFamily:'Poppins'}}>
                                {formErrors.duracion_horas}
                            </p>
                        )}
                    </div>

                    {islasDisponibles.length === 0 && (
                        <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'#e53e6d' }}>
                            Ups! No hay islas disponibles para este horario.
                        </p>
                    )}

                    {error && (
                        <p className="help is-danger" style={{ fontFamily:'Poppins', marginTop:'0.5rem' }}>
                            {error}
                        </p>
                    )}
                </section>

                <footer className="modal-card-foot" style={{ borderRadius:'0 0 16px 16px', background:'#fff', borderTop:'1px solid #f0f0f0', justifyContent:'flex-end', gap:'0.75rem' }}>
                    <button className="button" onClick={onClose} style={{ fontFamily:'Poppins', borderRadius:'8px'}}>
                        Cancelar
                    </button>
                    <button className="button" onClick={onSubmit} disabled={loading || islasDisponibles.length === 0} style={{ background:'linear-gradient(135deg, #f97316, #e53e6d', color:'#fff', fontFamily:'Poppins', fontWeight:600, borderRadius:'8px', border:'none', opacity: loading ? 0.75 : 1}}>
                        { loading ? 'Reservando...' : 'Confirmar reserva'}
                    </button>
                </footer>
            </div>
        </div>
    );
}