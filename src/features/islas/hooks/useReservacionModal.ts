'use client';

import { use, useState } from "react";
import { islasService } from "../services/islasService";
import type { Isla } from "../types";

interface SlotSeleccionado {
    fecha: string;
    hora: string;
}

interface ReservacionForm {
    isla_id: number | null;
    duracion_horas: number;
}

type formErrors = Partial<Record<keyof ReservacionForm, string>>;

export function useReservacionMOdal(onSuccess: () => void) {
    const [ open, setOpen ] = useState(false);
    const [ slot, setSlot ]= useState<SlotSeleccionado | null>(null);
    const [ form, setForm ] = useState<ReservacionForm>({isla_id: null, duracion_horas:1 });
    const [ formErrors, setFormErrors ] = useState<formErrors>({});
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const openModal = (fecha:string, hora:string) => {
        setSlot({ fecha, hora });
        setForm({ isla_id: null, duracion_horas:1});
        setFormErrors({});
        setError(null);
        setOpen(true);
    };

    const close = () => {
        setOpen(false);
        setSlot(null);
        setError(null);
        setFormErrors({});
    };

    const validate = () : boolean => {
        const errors: formErrors = {};
        if (!form.isla_id) errors.isla_id = 'Selecciona una isla';
        if (form.duracion_horas < 1 || form.duracion_horas > 4)
            errors.duracion_horas = 'La duraciòn debe de ser entre 1 y 4 horas';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (islas: Isla[]) => {
        if (!validate() || !slot) return;
        setLoading(true);
        setError(null);
        try {
            await islasService.createReservacion({
                isla: form.isla_id!,
                fecha_reserva: slot.fecha,
                hora_inicio: `${slot.hora}:00`, // ← 'HH:MM:00' que es lo que TimeField espera
                duracion_horas: `${form.duracion_horas}`,
            });
            onSuccess();
            close();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear reservación');
        } finally {
            setLoading(false);
        }
    };

    return{
        open,
        slot,
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