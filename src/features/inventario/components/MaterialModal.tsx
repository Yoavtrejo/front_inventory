import type { CreateMaterialPayload } from "../types";
import type { Dispatch, SetStateAction } from 'react';

type FormErrors = Partial<Record<keyof CreateMaterialPayload, string>>;

interface MaterialModalProps {
    mode:     'create' | 'edit';
    form:     CreateMaterialPayload;
    loading:  boolean;
    error:    string | null;
    formErrors: FormErrors;
    onClose:  () => void;
    onSubmit: () => void;
    setForm:  Dispatch<SetStateAction<CreateMaterialPayload>>; // ← tipo correcto
}

export function MaterialModal({
    mode, form, loading, error, formErrors, onClose, onSubmit, setForm}: MaterialModalProps){
        const isEdit = mode === 'edit';
    const field = ( label: string, key: keyof CreateMaterialPayload, type: 'text' | 'number' = 'text' ) => (

        <div className="field">
            <label className="label" style={{ fontSize: '0.875rem', fontFamily:'Poppins', fontWeight:'400', color:'#374151' }}>
                {label}
            </label>
            <div className="control">
                <input 
                    className="input" 
                    type={type} 
                    value={form[key]} 
                    onChange={(e) => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                    style={{ borderRadius: '8px', fontSize: '0.875rem', padding: '0.5rem 0.75rem', fontFamily:'Poppins', borderColor:'#e5e7eb'}}
                />
            </div>
            {formErrors[key] && (
                <p className="help is-danger" style={{ fontFamily: 'Poppins' }}>
                    {formErrors[key]}
                </p>
            )}
        </div>
    );

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onClose} />
            <div className="modal-card" style={{borderRadius:'16px', maxWidth: '420px', width: '90%', boxShadow:'0 8px 40px rgba(0,0,0,0.13)'}}>

                <header className="modal-card-head" style={{borderRadius: '16px 16px 0 0', borderBottom: '1px solid #f0f0f0', background: '#ffffff', flexDirection:'column', alignItems:'center', padding:'1.25rem 1.5rem 1rem', position:'relative'}}>

                    <div style={{ display:'flex', gap:'6px',position:'absolute',top:'1.25rem', left:'1.25rem' }}>
                        <span style={{ width:16, height:16, borderRadius:'50%', background:'#e53e6d', display:'block' }}/>
                        <span style={{ width:16, height:16, borderRadius:'50%', background:'#f97316', display:'block' }}/>
                        <span style={{ width:16, height:16, borderRadius:'50%', background:'#facc15', display:'block' }}/>

                    </div>

                    <button className="delete" onClick={onClose} style={{ position:'absolute', top:'1.25rem', right:'1.25rem'}} />

                    <p style={{fontFamily:'Poppins',  fontSize: '1.5rem', fontWeight: '800', color:'#111827', marginTop:'0.5rem', textAlign:'center'}}>
                        {isEdit ? 'Editar material' : 'Registro de material'}
                    </p>
                    
                    <p style={{fontFamily:'Poppins', fontSize:'0.85rem', color: '#888', marginBottom:'0.25rem'}}>Completa lo siguiente</p>
                </header>

                <section className="modal-card-body" style={{ padding:'1.5rem', background:'#ffffff'}}>
                    {field('Nombre del material', 'name')}
                    {field('Descripción', 'description')}

                    <div style={{ display:'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        {field('Cantidad', 'quantity', 'number')}
                        {field('Stock minimo', 'min_stock', 'number')}
                        {field('Stock máximo', 'max_stock', 'number')}
                    </div>

                    {error && (
                        <p className="help is-danger" style={{ fontFamily:'Poppins', marginTop: '0.5rem'}}>{error}</p>
                    )}
                </section>

                <footer className="modal-card-foot" style={{ borderRadius:'0 0 16px 16px', background:'#ffffff', borderTop: '1px solid #f0f0f0', justifyContent: 'flex-end', gap:'0.75rem', padding:'1rem 1.5rem'}}>
                    <button className="button" onClick={onClose} style={{ borderRadius:'8px', fontFamily:'Poppins', borderColor:'#e5e7eb', color:'#555'}}>
                        Cancelar
                    </button>
                    <button className="button" onClick={onSubmit} disabled={loading} style={{fontFamily: 'Poppins', background: '#D81E5B', color:'#fff', fontWeight:600, borderRadius:'8px', border:'none', opacity: loading ? 0.75 : 1, padding:'0.5rem 2rem'}}>
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </footer>
            </div>
        </div>
    )
}