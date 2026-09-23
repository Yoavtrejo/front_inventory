'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { academicService } from '@/features/academic';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { getApiErrorMessage } from '@/utils/apiResponse';

export interface ActividadForm {
    title: string;
    description: string;
    partial_period: number;
    is_team_activity: boolean;
    group: number | null;
    teacher_file: File | null;
}

type ActividadFormErrors = Partial<Record<keyof ActividadForm, string>>;

const INITIAL_FORM: ActividadForm = {
    title: '', description: '', partial_period: 1, is_team_activity: false, group: null, teacher_file: null,
};

export function useCrearActividad() {
    const router = useRouter();
    const { showToast } = useToast();
    const [form, setForm] = useState<ActividadForm>(INITIAL_FORM);
    const [formErrors, setFormErrors] = useState<ActividadFormErrors>({});
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateField = <K extends keyof ActividadForm>(field: K, value: ActividadForm[K]) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const validate = (): boolean => {
        const errors: ActividadFormErrors = {};
        if (!form.title.trim()) errors.title = 'El nombre de la actividad es obligatorio.';
        if (!form.description.trim()) errors.description = 'Las instrucciones son obligatorias.';
        if (!form.group) errors.group = 'Selecciona un grupo.';
        if (form.partial_period < 1 || form.partial_period > 3) errors.partial_period = 'El parcial debe ser 1, 2 o 3.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate() || form.group === null) return;
        setSaving(true);
        setError(null);
        try {
            await academicService.createActivity({ ...form, title: form.title.trim(), description: form.description.trim(), group: form.group });
            showToast('Actividad creada correctamente.', 'success');
            router.push('/docente/actividades');
        } catch (err) {
            setError(getApiErrorMessage(err, 'No se pudo crear la actividad.'));
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => router.push('/docente/actividades');

    return { form, updateField, formErrors, saving, error, handleSubmit, handleCancel };
}
