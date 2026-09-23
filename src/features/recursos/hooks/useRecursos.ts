'use client';

import { useCallback, useEffect, useState } from 'react';
import { recursosService, isEndpointMissing } from '../services/recursosService';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { Recurso } from '../types';

interface RecursoForm {
    title: string;
    description: string;
    file: File | null;
}

type RecursoFormErrors = Partial<Record<keyof RecursoForm, string>>;

const EMPTY_FORM: RecursoForm = { title: '', description: '', file: null };

export function useRecursos() {
    const { showToast } = useToast();
    const [recursos, setRecursos] = useState<Recurso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBackendAvailable, setIsBackendAvailable] = useState(true);
    const [reloadKey, setReloadKey] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState<RecursoForm>(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState<RecursoFormErrors>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let isActive = true;
        recursosService.getAll()
            .then((data) => {
                if (!isActive) return;
                setRecursos(data);
                setIsBackendAvailable(true);
            })
            .catch((err: unknown) => {
                if (!isActive) return;
                if (isEndpointMissing(err)) setIsBackendAvailable(false);
                else setError(getApiErrorMessage(err, 'No se pudieron cargar los recursos.'));
            })
            .finally(() => {
                if (isActive) setLoading(false);
            });
        return () => { isActive = false; };
    }, [reloadKey]);

    const openModal = () => {
        setForm(EMPTY_FORM);
        setFormErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const updateField = <K extends keyof RecursoForm>(field: K, value: RecursoForm[K]) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = async () => {
        const errors: RecursoFormErrors = {};
        if (!form.title.trim()) errors.title = 'El título es obligatorio.';
        if (!form.description.trim()) errors.description = 'La descripción es obligatoria.';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        setSaving(true);
        try {
            await recursosService.create({ title: form.title.trim(), description: form.description.trim(), file: form.file });
            showToast('Recurso guardado.', 'success');
            setIsModalOpen(false);
            setReloadKey((key) => key + 1);
        } catch (err) {
            showToast(
                isEndpointMissing(err) ? 'El backend aún no tiene el módulo de recursos.' : getApiErrorMessage(err, 'No se pudo guardar el recurso.'),
                'error',
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = useCallback(async (recursoId: number) => {
        try {
            await recursosService.delete(recursoId);
            setRecursos((prev) => prev.filter((recurso) => recurso.id !== recursoId));
        } catch (err) {
            showToast(getApiErrorMessage(err, 'No se pudo eliminar el recurso.'), 'error');
        }
    }, [showToast]);

    return {
        recursos, loading, error, isBackendAvailable,
        isModalOpen, openModal, closeModal, form, updateField, formErrors, saving, handleSubmit, handleDelete,
    };
}
