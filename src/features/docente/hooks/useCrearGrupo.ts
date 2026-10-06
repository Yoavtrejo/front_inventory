'use client';

import { useEffect, useState } from 'react';
import { academicService } from '@/features/academic';
import { EMPTY_COHORTE, isCohorteComplete } from '@/features/cohorte';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { Subject } from '@/features/academic';
import type { CohorteValue } from '@/features/cohorte';

export function useCrearGrupo(onCreated: () => void) {
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subjectId, setSubjectId] = useState<number | null>(null);
    const [cohorte, setCohorte] = useState<CohorteValue>(EMPTY_COHORTE);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        let isActive = true;
        academicService.getSubjects()
            .then((data) => { if (isActive) setSubjects(data); })
            .catch(() => { if (isActive) setSubjects([]); });
        return () => { isActive = false; };
    }, [isOpen]);

    const open = () => {
        setSubjectId(null);
        setCohorte(EMPTY_COHORTE);
        setError(null);
        setIsOpen(true);
    };

    const close = () => setIsOpen(false);

    const save = async () => {
        if (subjectId === null || !isCohorteComplete(cohorte)) {
            setError('Selecciona la materia, la carrera, el cuatrimestre y el grupo.');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const group = await academicService.createGroup({
                subject: subjectId,
                carrera: cohorte.carrera as number,
                cuatrimestre: cohorte.cuatrimestre as number,
                grupo: cohorte.grupo as number,
            });
            const inscritos = group.students.length;
            showToast(`Grupo ${group.name} creado · ${inscritos} alumno${inscritos === 1 ? '' : 's'} inscrito${inscritos === 1 ? '' : 's'} automáticamente.`, 'success');
            setIsOpen(false);
            onCreated();
        } catch (err) {
            setError(getApiErrorMessage(err, 'No se pudo crear el grupo.'));
        } finally {
            setSaving(false);
        }
    };

    return { isOpen, open, close, subjects, subjectId, setSubjectId, cohorte, setCohorte, saving, error, save };
}
