'use client';

import { useState } from "react";
import { islasService } from "../services/islasService";
import type { Isla, CreateIslaPayload } from "../types";

type FormErrors = Partial<Record<keyof CreateIslaPayload, string>>;

const EMPTY_FORM : CreateIslaPayload = {
    numero_isla: 0,
    equipos_computo: 0,
    switches:0,
    routers:0,
    otros_componentes:{},
    estado:'Disponible'
};

export function useIslaModal(onSuccess: () => void) {
    const [ open, setOpen ] = useState(false);
    const [ form, setForm ] = useState<CreateIslaPayload>(EMPTY_FORM);
    const [ formErrors, setFormErrors ] = useState<FormErrors>({});
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);
    const [ editTarget, setEditTarget ] = useState<Isla | null>(null);
    const [ numerosUsados, setNumerosUsados ] = useState<number[]>([]);
    
    const validate = () : boolean => {
        const errors:  FormErrors = {};
        if (!form.numero_isla || form.numero_isla < 1)
            errors.numero_isla = 'El número de isla debe ser mayor a 0.';
        else if (numerosUsados.includes(form.numero_isla))
            errors.numero_isla = `Ya existe la Isla #${form.numero_isla}. Usa otro número.`;

        if (form.equipos_computo < 0)
            errors.equipos_computo = 'No puede ser negarivo.';
        
        if (form.switches < 0)
            errors.switches = 'No puede ser negativo,'

        if (form.routers < 0)
            errors.routers = 'No puede ser negativo.'

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Propone el siguiente número libre y evita el error de número duplicado del backend
    const openCreate = (islas: Isla[] = []) => {
        const numeros = islas.map((isla) => isla.numero_isla);
        setNumerosUsados(numeros);
        setForm({ ...EMPTY_FORM, numero_isla: numeros.length ? Math.max(...numeros) + 1 : 1 });
        setEditTarget(null);
        setError(null);
        setFormErrors({});
        setOpen(true)
    };

    const openEdit = (isla: Isla) => {
        setNumerosUsados([]);
        setForm({
            numero_isla: isla.numero_isla,
            equipos_computo: isla.equipos_computo,
            switches: isla.switches,
            routers: isla.routers,
            otros_componentes: {},
            estado: isla.estado
        });
        setEditTarget(isla);
        setError(null);
        setFormErrors({});
        setOpen(true);
    };

    const close = () =>{
        setOpen(false);
        setEditTarget(null);
        setError(null);
        setFormErrors({});
    };

    const handleSubmit = async () => {
        if(!validate()) return;
        setLoading(true);
        setError(null);
        try{
            if (editTarget) {
                await islasService.update(editTarget.id, form);
            }else{
                await islasService.create(form);
            }
            onSuccess();
            close();
        }catch (err){
            setError(err instanceof Error ? err.message : 'Error al guardar');
        }finally {
            setLoading(false);
        }
    };

    return {
        open,
        form,
        setForm,
        formErrors,
        loading,
        error,
        isEdit:  !!editTarget,
        openCreate, 
        openEdit, 
        close,
        handleSubmit
    };
}