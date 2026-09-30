
import type { Dispatch, SetStateAction } from 'react';
import type { CreateIslaPayload, IslaEstado } from '../types';

type FormErrors = Partial<Record<keyof CreateIslaPayload, string>>;

const ESTADOS: IslaEstado[] = ['Disponible', 'Reservada'];

interface IslaModalProps {
    isEdit: boolean;
    form: CreateIslaPayload;
    setForm: Dispatch<SetStateAction<CreateIslaPayload>>;
    formErrors: FormErrors;
    loading: boolean;
    error: string | null;
    onClose: () => void;
    onSubmit: () => void;
}

export function IslaModal({ isEdit, form, setForm, formErrors, loading, error, onClose, onSubmit }: IslaModalProps) {

    const numField = (label: string, key: keyof CreateIslaPayload) => (
  
        <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.35rem' }}>{label}</label>
            <input
                className={`input islas-input ${formErrors[key] ? 'is-danger' : ''}`}
                type="number"
                min={0}
                value={form[key] as number}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                style={{ fontFamily:'Poppins', fontSize:'0.875rem', borderRadius:'8px', width:'100%' }}
            />
            {formErrors[key] && (
                <p style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
                    {formErrors[key]}
                </p>
            )}
        </div>
    );

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose} />
            <div className="modal-card islas-modal" style={{ borderRadius: '16px', maxWidth: '460px', width: '90%', overflow:'hidden', maxHeight:'90vh' }}>
            
                <header className="modal-card-head" style={{borderRadius: '16px 16px 0 0', borderBottom: '1px solid var(--border)', background: 'var(--surface)', flexDirection:'column', alignItems:'center', padding:'1rem 1.5rem 0.75rem', position:'relative', display:'flex'}}>

                    <div style={{ display:'flex', gap:'6px',position:'absolute',top:'1.25rem', left:'1.25rem' }}>
                        <span style={{ width:16, height:16, borderRadius:'50%', background:'#e53e6d', display:'block' }}/>
                        <span style={{ width:16, height:16, borderRadius:'50%', background:'#f97316', display:'block' }}/>
                        <span style={{ width:16, height:16, borderRadius:'50%', background:'#facc15', display:'block' }}/>
                    </div>

                    <button className="delete" onClick={onClose} style={{ position:'absolute', top:'1.25rem', right:'1.25rem'}} />
    
                    <p style={{fontFamily:'Poppins',  fontSize: '1.5rem', fontWeight: '800', color:'var(--text)', marginTop:'0.5rem', textAlign:'center'}}>
                        Registro de isla
                    </p>
                </header>

                <section className="modal-card-body" style={{ padding: '1.25rem 1.5rem' }}>
                    <p style={{ fontFamily: 'Poppins',fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                        Completa la información de la isla
                    </p>

                    {numField('Número de isla', 'numero_isla')}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                            <label style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.35rem' }}>Equipos de cómputo</label>
                            <input
                                className="input islas-input"
                                type="number"
                                min={0}
                                value={form.equipos_computo}
                                onChange={(e) => setForm((prev) => ({ ...prev, equipos_computo: Number(e.target.value) }))}
                                style={{ fontFamily:'Poppins', fontSize:'0.875rem', borderRadius:'8px', width:'100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.35rem' }}>Switches</label>
                            <input
                                className="input islas-input"
                                type="number"
                                min={0}
                                value={form.switches}
                                onChange={(e) => setForm((prev) => ({ ...prev, switches: Number(e.target.value) }))}
                                style={{ fontFamily:'Poppins', fontSize:'0.875rem', borderRadius:'8px', width:'100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.35rem' }}>Routers</label>
                            <input
                                className="input islas-input"
                                type="number"
                                min={0}
                                value={form.routers}
                                onChange={(e) => setForm((prev) => ({ ...prev, routers: Number(e.target.value) }))}
                                style={{ fontFamily:'Poppins', fontSize:'0.875rem', borderRadius:'8px', width:'100%' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.35rem' }}>Otros componentes</label>
                        <input
                            className="input islas-input"
                            type="text"
                            value={ typeof form.otros_componentes === 'string' ? form.otros_componentes : Object.values(form.otros_componentes).join(', ')}
                            onChange={(e) => setForm((prev) => ({...prev, otros_componentes: e.target.value ? { descripcion: e.target.value }: { descripcion: '' },}))}
                            placeholder="Ej: Proyector, cámara..."
                            style={{fontFamily:'Poppins', fontSize:'0.875rem', borderRadius:'8px', width:'100%'}}
                        />
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-soft)', display: 'block', marginBottom: '0.35rem' }}>Estado inicial</label>
                        <div className="select is-fullwidth islas-select">
                            <select value={form.estado} onChange={(e) => setForm((prev) => ({ ...prev, estado: e.target.value as IslaEstado }))} style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px', width: '100%' }}>
                                {ESTADOS.map((e) => (
                                    <option key={e} value={e}>{e}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && (
                        <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--color-secondary)', marginTop: '0.5rem' }}>
                            {error}
                        </p>
                    )}
                </section>

                <footer className="modal-card-foot" style={{ borderRadius: '0 0 16px 16px', background: 'var(--surface)', borderTop: '1px solid var(--border)', justifyContent: 'flex-end', gap: '0.75rem', padding: '1rem 1.5rem' }}>
                    <button 
                        className="button" 
                        onClick={onClose} 
                        style={{ fontFamily: 'Poppins', borderRadius: '8px' }}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={loading}
                        style={{background: 'linear-gradient(135deg, var(--color-gradient-start), var(--color-gradient-end))', color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', borderRadius: '8px', border: 'none', padding: '0.5rem 1.25rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1 }}
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </footer>
            </div>
        </div>
    );
}