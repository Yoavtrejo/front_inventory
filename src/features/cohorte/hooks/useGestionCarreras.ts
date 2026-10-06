'use client';

import { useState } from 'react';
import { carrerasService } from '../services/carrerasService';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { Carrera } from '../types';

interface CarreraForm {
    nombre: string;
    clave: string;
}

export function useGestionCarreras(onSaved: () => void) {
    const { showToast } = useToast();
    const [form, setForm] = useState<CarreraForm | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [toDelete, setToDelete] = useState<Carrera | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const openCreate = () => { setForm({ nombre: '', clave: '' }); setEditingId(null); setError(null); };
    const openEdit = (carrera: Carrera) => { setForm({ nombre: carrera.nombre, clave: carrera.clave ?? '' }); setEditingId(carrera.id); setError(null); };
    const close = () => setForm(null);

    const save = async () => {
        if (!form) return;
        const clave = form.clave.trim().toUpperCase().replace(/\s+/g, '');
        if (!form.nombre.trim() || !clave) {
            setError('El nombre y la clave son obligatorios.');
            return;
        }
        if (!/^[A-Z]{2,10}$/.test(clave)) {
            setError('La clave debe tener de 2 a 10 letras, sin números ni espacios (p. ej. ISC).');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const payload = { nombre: form.nombre.trim(), clave };
            if (editingId) await carrerasService.update(editingId, payload);
            else await carrerasService.create(payload);
            showToast('Carrera guardada.', 'success');
            setForm(null);
            onSaved();
        } catch (err) {
            setError(getApiErrorMessage(err, 'No se pudo guardar la carrera.'));
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        setSaving(true);
        try {
            await carrerasService.delete(toDelete.id);
            showToast('Carrera eliminada.', 'success');
            setToDelete(null);
            onSaved();
        } catch (err) {
            showToast(getApiErrorMessage(err, 'No se pudo eliminar la carrera.'), 'error');
        } finally {
            setSaving(false);
        }
    };

    return { form, setForm, isEditing: editingId !== null, openCreate, openEdit, close, save, toDelete, setToDelete, confirmDelete, saving, error };
}
