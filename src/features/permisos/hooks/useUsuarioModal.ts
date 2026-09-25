'use client';

import { useState } from 'react';
import { permisosService } from '../services/permisosService';
import { rolToFlags } from '../types';
import type { Usuario, RolUsuario } from '../types';
import { useToast } from '@/components/ui/Toast/ToastContext';

interface UsuarioForm {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    rol: RolUsuario;
    is_active: boolean;
}

type FormErrors = Partial<Record<keyof UsuarioForm, string>>;

const EMPTY_FORM: UsuarioForm = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    rol: 'Alumno',
    is_active: true,
}

export function useUsuarioModal(onSuccess: () => void) {
    const { showToast } = useToast();
    const [ open, setOpen ] = useState(false);
    const [ editTarget, setEditTarget ] = useState<Usuario | null>(null);
    const [ form, setForm ] = useState<UsuarioForm>(EMPTY_FORM);
    const [ formErrors, setFormErrors ] = useState<FormErrors>({});
    const [ loading, setLoading ] = useState(false);

    const validate = () : boolean => {
        const errors: FormErrors = {};
        if(!form.first_name.trim()) errors.first_name = 'EL nombre es obligatorio';
        if(!form.last_name.trim()) errors.last_name = 'EL apellido es obligatorio';
        if(!form.username.trim()) errors.username = 'El usuario es obligatorio';
        if(!form.email.trim()) errors.email = 'El correo es obligatorio';
        if(!editTarget && !form.password.trim())
            errors.password = 'La contraseña es obligatoria';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const openCreate = () => {
        setForm(EMPTY_FORM);
        setEditTarget(null);
        setFormErrors({});
        setOpen(true);
    }

    const openEdit = (usuario: Usuario) => {
        setForm({
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            username: usuario.username,
            email: usuario.email,
            password: '',
            rol: usuario.is_superuser ? 'Administrador' : usuario.is_staff ? 'Docente' : 'Alumno',
            is_active: usuario.is_active,
        });
        setEditTarget(usuario);
        setFormErrors({});
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        setEditTarget(null);
        setFormErrors({});
    }

    const handleSubmit = async () => {
        if(!validate()) return;
        setLoading(true);
        try {
            const flags = rolToFlags(form.rol);

            if (editTarget) {
                await permisosService.update(editTarget.id, {
                    first_name: form.first_name,
                    last_name: form.last_name,
                    username: form.username,
                    email: form.email,
                    is_active: form.is_active,
                    ...flags,
                });
                showToast('Usuario actualizado correctamente', 'success');
            }else {
                await permisosService.create({
                    first_name: form.first_name,
                    last_name: form.last_name,
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    is_active: form.is_active,
                    ...flags,
                });
                showToast('Usuario creado correctamente', 'success');
            }
            onSuccess();
            close();
        } catch (error) {
            showToast(error instanceof Error ? error.message : 'Error al guardar el usuario', 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        open,
        form,
        setForm,
        formErrors,
        loading,
        isEdit: !!editTarget,
        openCreate,
        openEdit,
        close,
        handleSubmit
    };
};