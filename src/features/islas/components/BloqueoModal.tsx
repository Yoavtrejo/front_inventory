import type { Dispatch, SetStateAction } from "react";
import type { Isla } from "../types";

interface BloqueoForm {
    isla_id: number | null;
    hora_inicio: string;
    hora_fin: string,
    motivo: string;
}

type FormErrors = Partial<Record<keyof BloqueoForm, string>>;

const HORAS_OPCIONES = [
    '08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00',
];

interface BloqueoModalProps {
    fecha: string;
    form: BloqueoForm;
    setForm: Dispatch<SetStateAction<BloqueoForm>>;
    formErrors: FormErrors;
    loading: boolean;
    error: string | null;
    islas: Isla[];
    onClose: () => void;
    onSubmit: () => void;
}

export function BloqueoModal({ fecha, form, setForm, formErrors, loading, error, islas, onClose, onSubmit } : BloqueoModalProps ){
    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose}/>
            <div className="modal-card islas-modal" style={{ borderRadius:'16px', maxWidth:'460px', width:'90%', overflow:'hidden'}}>

                <header className="modal-card-head" style={{ borderRadius:'16px 16px 0 0', background:'var(--surface)', borderBottom:'1px solid var(--border)', padding:'1rem 1.5rem', display:'flex', alignItems:'center',justifyContent:'space-between' }}>
                    <p style={{ fontFamily:'Poppins', fontSize:'1.1rem', fontWeight:700, color:'var(--text)', margin:0}}>
                        Bloquear horario
                    </p>
                    <button className="delete" onClick={onClose}/>
                </header>

                <section className="modal-card-body" style={{ padding:'1.25rem 1.5rem' }}>
                    
                    <div style={{ background:'var(--isla-blocked-bg)', borderRadius:'8px', padding:'0.6rem 1rem', marginBottom:'1.25rem' }}>
                        <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'var(--isla-blocked-text)', margin:0 }}>
                            <strong>Fecha:</strong> {fecha}
                        </p>
                    </div>

                    <div style={{ marginBottom:'0.75rem' }}>
                        <label style={{ fontFamily:'Poppins', fontSize:'0.875rem', fontWeight:500, color:'var(--text-soft)', display:'block', marginBottom:'0.35rem' }}>Isla afectada</label>
                        <div className="select is-fullwidth islas-select">
                            <select value={form.isla_id ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, isla_id:e.target.value === '' ? null : Number(e.target.value)}))} style={{ fontFamily:'Poppins', fontSize:'0.875rem' }}>
                                <option value="">Todas las islas</option>
                                {islas.map((isla) => (
                                    <option key={isla.id} value={isla.id}>
                                        Isla #{isla.numero_isla}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'0.75rem' }}>
                        <div>
                            <label style={{ fontFamily:'Poppins', fontSize:'0.875rem', fontWeight:500, color:'var(--text-soft)', display:'block', marginBottom:'0.35rem'}}>Hora inicio</label>
                            <div className="select is-fullwidth islas-select">
                                <select value={form.hora_inicio} onChange={(e) => setForm((prev) => ({ ...prev, hora_inicio: e.target.value }))} style={{ fontFamily:'Poppins', fontSize:'0.875rem' }}>
                                    {HORAS_OPCIONES.map((h) => (
                                        <option key={h} value={h}>{h}</option>
                                    ))}
                                </select>
                            </div>
                            {formErrors.hora_inicio && (
                                <p style={{ color:'var(--color-secondary)', fontSize:'0.78rem', fontFamily:'Poppins', marginTop:'0.25rem '}}>
                                    {formErrors.hora_inicio}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontFamily:'Poppins', fontSize:'0.875rem', fontWeight:500, color:'var(--text-soft)', display:'block', marginBottom:'0.35rem' }}>Motivo</label>
                        <input 
                            type="text" 
                            className={`input islas-input ${formErrors.motivo ? 'is-danger' : ''}`}
                            value={form.motivo}
                            onChange={(e) => setForm((prev) => ({ ...prev, motivo: e.target.value }))}                                placeholder="Ej: Mantenimiento, evento especial..."
                            style={{ fontFamily:'Poppins', fontSize:'0.875rem', borderRadius:'8px' }}
                        />
                        {formErrors.motivo && (
                            <p style={{ color:'var(--color-secondary)', fontSize:'0.78rem', fontFamily:'Poppins', marginTop:'0.25rem'}}>
                                {formErrors.motivo}
                            </p>
                        )}
                    </div>
                    
                    {error && (
                        <p style={{ color:'var(--color-secondary)', fontSize:'0.85rem', fontFamily:'Poppins', marginTop:'0.5rem'}}>
                            {error}
                        </p>
                    )}

                </section>

                <footer className="modal-card-foot" style={{ borderRadius:'0 0 16px 16px', background:'var(--surface)', borderTop:'1px solid var(--border)', justifyContent:'flex-end', gap:'0.75rem', padding:'1rem 1.5rem'}}>
                    <button
                        onClick={onClose}
                        className="button"
                        style={{ fontFamily:'Poppins', borderRadius:'8px'}}
                    >Cancelar</button>
                    <button
                        onClick={onSubmit}
                        disabled={loading}
                        style={{ background:'linear-gradient(135deg, #991b1b, var(--color-gradient-end))', color:'#fff', fontFamily:'Poppins', fontWeight:600, fontSize:'0.9rem', borderRadius:'8px',border:'none', padding:'0.5rem 1.25rem', cursor:loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1}}
                    >
                        {loading ? 'Bloqueando...' : 'Confirmar bloqueo'}
                    </button>
                </footer>

            </div>
        </div>
    );
}

