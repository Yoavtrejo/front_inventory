import { Modal } from "@/components/ui/Modal/Modal";
import { ModalCancelButton, ModalSubmitButton } from "@/components/ui/Modal/ModalButtons";
import type { CreateMaterialPayload } from "../types";
import type { Dispatch, SetStateAction } from 'react';
import type { MaterialStatus } from "../types";

type FormErrors = Partial<Record<keyof CreateMaterialPayload, string>>;

interface MaterialModalProps {
    mode:     'create' | 'edit';
    form:     CreateMaterialPayload;
    loading:  boolean;
    error:    string | null;
    formErrors: FormErrors;
    onClose:  () => void;
    onSubmit: () => void;
    setForm:  Dispatch<SetStateAction<CreateMaterialPayload>>;
}

export function MaterialModal({ mode, form, loading, error, formErrors, onClose, onSubmit, setForm}: MaterialModalProps){ 
    
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
        <Modal 
            open 
            title={isEdit ? 'Editar material' : 'Registro de material'} 
            onClose={onClose}
            footer={
                <>
                    <ModalCancelButton onClick={onClose} />
                    <ModalSubmitButton 
                        onClick={onSubmit} 
                        loading={loading} 
                        label={isEdit ? 'Guardar cambios' : 'Guardar'} 
                    />
                </>
            }
        >
            <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'#888', marginBottom:'1.25rem' }}>
                Completa lo siguiente
            </p>

            {field('Nombre del material', 'name')}
            {field('Descripción', 'description')}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
                {field('Cantidad', 'quantity', 'number')}
                {field('Stock min.', 'min_stock', 'number')}
                {field('Stock max.', 'max_stock', 'number')}
            </div>

            {error && (
                <p style={{ color:'#e53e6d', fontFamily:'Poppins', fontSize:'0.85rem', marginTop:'0.5rem' }}>
                    {error}
                </p>
            )}
        </Modal>
    )
}