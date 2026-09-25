'use client';

import { useState, useEffect } from 'react';
import { perfilService } from '../services/perfilService';
import { useToast } from '@/components/ui/Toast/ToastContext';
import type { Perfil, UpdatePerfilPayload } from '../types';

interface PerfilForm {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
}

type FormErrors = Partial<Record<keyof PerfilForm, string>>;

export function usePerfil() {
    const { showToast } = useToast();
    const [perfil, setPerfil] = useState<Perfil | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form , setForm] = useState<PerfilForm>({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    
    useEffect(() => {
        async function fetchPerfil() {
            try{
                const data = await perfilService.get();
                setPerfil(data);
                setForm({
                    first_name: data.first_name,
                    last_name: data.last_name,
                    username: data.username,
                    email: data.email,
                    password: '',
                });
            } catch (err) {
                showToast('Error al cargar el perfil', 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchPerfil();
    }, [showToast]);

    const validate = (): boolean => {
        const errors: FormErrors = {};
        if (!form.first_name.trim()) errors.first_name = 'El nombre es obligatorio';
        if (!form.last_name.trim()) errors.last_name = 'El apellido es obligatorio';
        if (!form.email.trim()) errors.email = 'El correo es obligatorio';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        try{
            const payload: UpdatePerfilPayload = {
                first_name: form.first_name,
                last_name: form.last_name,
                email: form.email,
            };
            if (form.password.trim()) {
                payload.password = form.password;
            }

            const update = await perfilService.update(payload);
            setPerfil(update);
            setEditMode(false);
            showToast('Perfil actualizado correctamente', 'success');
        } catch (err) {
            showToast(err instanceof Error ? err.message : 'Error al guardar', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (perfil) {
            setForm({
                first_name: perfil.first_name,
                last_name: perfil.last_name,
                username: perfil.username,
                email: perfil.email,
                password: '',
            });
        }
        setFormErrors({});
        setEditMode(false);
    };

    return {
        perfil, 
        loading,
        saving,
        editMode,
        setEditMode,
        form,
        setForm,
        formErrors,
        handleSave,
        handleCancel,
    };

}