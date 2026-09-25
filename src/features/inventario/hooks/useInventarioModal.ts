'use client';

import { useState } from "react";
import { inventarioService } from "../services/inventarioService";
import type { Material, CreateMaterialPayload } from "../types";

type ModalMode = 'create' | 'edit' | null;
type FormErrors = Partial<Record<keyof CreateMaterialPayload, string>>;

export function useInventarioModal(onSuccess: () => void){
    const [ mode, setMode ] = useState<ModalMode>(null);
    const [ current, setCurrent ] = useState<Material | null>(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ formErrors, setFormErrors ] = useState<FormErrors>({});

    const [ form, setForm ] = useState<CreateMaterialPayload>({ name: '', description: '', quantity: 0, min_stock: 0, max_stock: 0, status: 'Disponible'});

    const validate = (): boolean => {
        const errors: FormErrors ={};
        if (!form.name.trim()) {
            errors.name = 'El nombre es obligatorio';
        }
        if (!form.description.trim()){
            errors.description = 'La descripción es obligatoria';
        }
        if (form.quantity < 0){
            errors.quantity = 'La cantidad no puede ser negativa';
        }
        if (form.min_stock < 0){
            errors.min_stock = 'El stock mínimo no puede ser negativo';
        }
        if (form.max_stock <= 0){
            errors.max_stock = 'El stock máximo debe de ser mayor a 0';
        }
        if (form.min_stock > form.max_stock){
            errors.min_stock = 'El stock mínimo no puede ser mayor al stock máximo';
            errors.max_stock = 'El stock máximo no puede ser menor al stock mínimo';
        }
        if (form.quantity < form.max_stock){
            errors.quantity = 'La cantidad no puede superar al stock máximo';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const openCreate = () => {
        setForm({ name: '', description: '', quantity: 0, min_stock: 0, max_stock: 0 , status: 'Disponible'});
        setCurrent(null);
        setMode('create');
        setError(null);
        setFormErrors({});
    }
    
    const openEdit = (material: Material) => {
        setForm({
            name:        material.name,
            description: material.description,
            quantity:    material.quantity,
            min_stock:   material.min_stock,
            max_stock:   material.max_stock,
            status: material.status
        });
        setCurrent(material);  
        setMode('edit');
        setError(null);
        setFormErrors({});
    };

    const close = () => {
        setMode(null);
        setCurrent(null);
        setError(null);
        setFormErrors({});
    };

    const handleSubmit = async () => {
        if (!validate())return;
        setLoading(true);
        setError(null);
        try{
            if (mode === 'create'){
                await inventarioService.create(form);
            }else if (mode === 'edit' && current){
                await inventarioService.update(current.id, form);
            }
            onSuccess();
            close();
        } catch (err){
            const mensaje = err instanceof Error ? err.message : 'Error al guardar el material';
            setError(mensaje);
        } finally {
            setLoading(false);
        }
    };

    return {
        mode,
        form,
        setForm,   
        loading,
        error,
        formErrors,
        openCreate,
        openEdit,
        close,
        handleSubmit,
    };
}