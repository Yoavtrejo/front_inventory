'use client';

import { useEffect, useState } from 'react';
import { perfilService } from '@/features/perfil';
import { EMPTY_COHORTE, isCohorteComplete } from '@/features/cohorte';
import type { CohorteValue } from '@/features/cohorte';

// Alumnos registrados antes de pedir cuatrimestre y grupo: los completan una sola vez
export function useCompletarGrupo() {
    const [isMissing, setIsMissing] = useState(false);
    const [value, setValue] = useState<CohorteValue>(EMPTY_COHORTE);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedLabel, setSavedLabel] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;
        perfilService.get()
            .then((perfil) => {
                if (!isActive) return;
                setValue({ carrera: perfil.carrera_id, cuatrimestre: perfil.cuatrimestre, grupo: perfil.grupo });
                setIsMissing(perfil.cuatrimestre === null || perfil.grupo === null || perfil.carrera_id === null);
            })
            .catch(() => { /* si falla, no se interrumpe al alumno */ });
        return () => { isActive = false; };
    }, []);

    const save = async () => {
        if (!isCohorteComplete(value)) {
            setError('Selecciona tu carrera, cuatrimestre y grupo.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const perfil = await perfilService.update({
                carrera: value.carrera ?? undefined,
                cuatrimestre: value.cuatrimestre ?? undefined,
                grupo: value.grupo ?? undefined,
            });
            setSavedLabel(perfil.grupo_escolar ?? `${perfil.cuatrimestre}° · grupo ${perfil.grupo}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo guardar tu grupo.');
        } finally {
            setSaving(false);
        }
    };

    // Recarga para que las vistas tomen las nuevas inscripciones
    const finish = () => window.location.reload();

    // "Más tarde": se oculta ahora y se vuelve a pedir en el próximo inicio de sesión
    const dismiss = () => setIsMissing(false);

    return { isMissing, value, setValue, saving, error, savedLabel, save, finish, dismiss };
}
