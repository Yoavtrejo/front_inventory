import type { Dispatch, SetStateAction } from 'react';
import { Modal } from '@/components/ui/Modal/Modal';;
import { ModalCancelButton, ModalSubmitButton } from '@/components/ui/Modal/ModalButtons';
import { RolUsuario } from '../types';
import { generarContrasena } from '@/utils';
import { CohorteFields, useCarreras } from '@/features/cohorte';
import type { CohorteValue } from '@/features/cohorte';

interface UsuarioForm {
    first_name: string;
    last_name: string;
    username: string; 
    email: string;
    password: string;
    rol: RolUsuario;
    is_active: boolean;
    cohorte: CohorteValue;
}

type FormErrors = Partial<Record<keyof UsuarioForm, string>>;

interface UsuarioModalProps {
    isEdit: boolean;
    form: UsuarioForm;
    setForm: Dispatch<SetStateAction<UsuarioForm>>;
    formErrors: FormErrors;
    loading: boolean;
    onSubmit: () => void;
    onClose: () => void;
}

const ROLES: RolUsuario[] = ['Administrador', 'Docente', 'Alumno'];

export function UsuarioModal({ isEdit, form, setForm, formErrors, loading, onClose, onSubmit } : UsuarioModalProps) {
    const { carreras } = useCarreras();

    const field = ( label:string, key: keyof UsuarioForm, type: string = 'text' ) => (
        <div style={{ marginBottom:'0.75rem'}}>
            <label style={{ fontFamily:'Poppins', fontSize:'0.875rem', fontWeight:500 as const, color:'#555', display:'block' as const, marginBottom:'0.35rem' }}>{label}</label>
            <input
                className={`input ${formErrors[key] ? 'is-danger': ''}`}
                type={type}
                value={form[key] as string}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                style={{ fontFamily:'Poppins', fontSize: '0.875rem', borderRadius:'8px'}}
            />
            {formErrors[key] && (
                <p style={{ color:'#e53e6d', fontSize:'0.78rem', fontFamily:'Poppins', marginTop:'0.25rem'}}>
                    {formErrors[key]}
                </p>
            )}
        </div>
    );

    return (
        <Modal 
            open
            title={isEdit ? 'Editar Usuario' : 'Agregar Usuario'}
            onClose={onClose}
            footer={
                <>
                    <ModalCancelButton onClick={onClose} />
                    <ModalSubmitButton onClick={onSubmit} loading={loading} label={isEdit ? 'Guardar Cambios' : 'Crear Usuario'} />
                </>
            }
        >
            <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'#888', marginBottom:'1.25rem'}}>
                Completa la información del usuario.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem'}}>
                {field('Nombre(s)', 'first_name')}
                {field('Apellido(s)', 'last_name')}
            </div>
            {field('Matrícula / Usuario', 'username')}
            {field('Correo electrònico', 'email', 'email')}

            <div style={{ marginBottom: '0.75rem' }}>
                <label style={{fontFamily:'Poppins', fontSize:'0.875rem', fontWeight:500 as const, color:'#555', display:'block' as const, marginBottom:'0.35rem'}}>
                    {isEdit ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        className={`input ${formErrors.password ? 'is-danger' : ''}`}
                        type="text"
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                        style={{ fontFamily:'Poppins', fontSize: '0.875rem', borderRadius:'8px', flex: 1 }}
                        placeholder="Contraseña"
                    />
                    <button
                        type="button"
                        onClick={() => setForm((prev) => ({
                            ...prev, password: generarContrasena()}))}
                        style={{background:'linear-gradient(135deg, #f97316, #e53e6d)',color:'#fff', border:'none', borderRadius:'8px',padding:'0 1rem', cursor:'pointer',fontFamily:'Poppins',fontSize:'0.8rem',fontWeight:600,whiteSpace:'nowrap',}}
                    >
                        Generar
                    </button>
                </div>
                
                {formErrors.password && (
                    <p style={{ color: '#e53e6d', fontSize: '0.78rem', fontFamily: 'var(--font-poppins)', marginTop: '0.25rem' }}>
                        {formErrors.password}
                    </p>
                )}
            </div>
            
            <div style={{ marginBottom:'0.75rem' }}>
                <label style={{ fontFamily:'Poppins', fontSize:'0.875rem', fontWeight: 500 as const, color:'#555', display:'block' as const, marginBottom:'0.35rem' }}>Rol</label>
                <div className="select is-fullwidth">
                    <select 
                        value={form.rol}
                        onChange={(e) => setForm((prev) => ({ ...prev, rol: e.target.value as RolUsuario }))}
                        style={{ fontFamily:'Poppins', fontSize: '0.875rem' }}
                    >
                        {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
            </div>

            {form.rol === 'Alumno' && (
                <div style={{ marginBottom: '0.75rem', padding: '0.75rem', border: '1px solid #f0f0f0', borderRadius: '10px' }}>
                    <CohorteFields
                        value={form.cohorte}
                        onChange={(cohorte) => setForm((prev) => ({ ...prev, cohorte }))}
                        carreras={carreras}
                        labelStyle={{ fontFamily:'Poppins', fontSize:'0.875rem', fontWeight: 500, color:'#555', display:'block', marginBottom:'0.35rem' }}
                    />
                    {isEdit && (
                        <p style={{ fontFamily: 'Poppins', fontSize: '0.75rem', color: '#888', margin: '0.5rem 0 0' }}>
                            Si cambias el grupo, el alumno pasa automáticamente a las materias de su nuevo grupo.
                        </p>
                    )}
                    {formErrors.cohorte && (
                        <p style={{ color: '#e53e6d', fontSize: '0.78rem', fontFamily: 'Poppins', marginTop: '0.25rem' }}>{formErrors.cohorte}</p>
                    )}
                </div>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <input 
                    type="checkbox" 
                    id="is_active" 
                    checked={form.is_active} 
                    onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                    style={{ width:16, height:16, accentColor:'#E53E6D', cursor:'pointer' }}
                />
                <label htmlFor="is_active" style={{ fontFamily:'Poppins', fontSize:'0.875rem', color:'#555', cursor:'pointer'}}>
                    Usuario activo
                </label>
            </div>
        </Modal>
    )
}