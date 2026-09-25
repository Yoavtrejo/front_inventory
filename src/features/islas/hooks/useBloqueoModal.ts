'use client';

import { useState } from "react";
import { islasService } from "../services/islasService";
import type { CreateHorarioBloqueadoPayload } from "../types";

interface BloqueoForm {
    isla_id: number | null;
    hora_inicio: string;
    hora_fin: string;
    motivo: string;
}

type FormErrors = Partial<Record<keyof BloqueoForm, string>>;

export function useBloqueoModal (onSuccess: () => void){
    const [ open, setOpen ] = useState(false);
    const [ fecha, setFecha ] = useState('');
    const [ form, setForm ] = useState<BloqueoForm>({
        isla_id: null,
        hora_inicio: '08:00',
        hora_fin: '09:00',
        motivo: 'Mantenimiento',
    });

    const [ formErrors, setFormErrors ] = useState<FormErrors>({});
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const openModal = (fechaSlot: string, horaSlot: string) => {
        const horaNum = parseInt(horaSlot.slice(0, 2), 10);
        const horaFin = `${String(horaNum + 1).padStart(2,'0')}:00`;

        setFecha(fechaSlot);
        setForm((prev) => ({
            ...prev, hora_inicio: horaSlot, hora_fin: horaFin
        }));
        setFormErrors({});
        setError(null);
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        setError(null);
        setFormErrors({});
    };

    const validate = (): boolean => {
        const errors: FormErrors = {};
        if (!form.hora_inicio) errors.hora_inicio = 'Requerido';
        if (!form.hora_fin) errors.hora_fin = 'Requerido';
        if (form.hora_fin <= form.hora_inicio)
            errors.hora_fin = 'La hora fin debe ser mayor a la hora inicio';
        if (!form.motivo.trim()) errors.motivo = 'El motivo es requerido';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        setError(null);
        try{
            await islasService.createHorarioBloqueado({
                isla: form.isla_id,
                fecha, 
                hora_inicio: `${form.hora_inicio}:00`,
                hora_fin: `${form.hora_fin}:00`,
                motivo: form.motivo
            });
            onSuccess();
            close();
        }catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear bloqueo');
        }finally{
            setLoading(false);
        }
    };

    return{
        open, 
        fecha,
        form,
        setForm,
        formErrors,
        loading,
        error,
        openModal,
        close,
        handleSubmit
    };
}