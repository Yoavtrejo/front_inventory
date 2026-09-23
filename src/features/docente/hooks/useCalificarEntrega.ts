'use client';

import { useState } from 'react';
import { academicService } from '@/features/academic';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { Submission } from '@/features/academic';

export function useCalificarEntrega(onGraded: () => void) {
    const { showToast } = useToast();
    const [gradeDrafts, setGradeDrafts] = useState<Record<number, string>>({});
    const [savingId, setSavingId] = useState<number | null>(null);

    const gradeValue = (submission: Submission): string =>
        gradeDrafts[submission.id] ?? (submission.grade !== null ? String(Number(submission.grade)) : '');

    const setGradeDraft = (submissionId: number, value: string) =>
        setGradeDrafts((prev) => ({ ...prev, [submissionId]: value }));

    const saveGrade = async (submission: Submission) => {
        const grade = Number(gradeValue(submission));
        if (gradeValue(submission) === '' || Number.isNaN(grade) || grade < 0 || grade > 10) {
            showToast('La calificación debe estar entre 0 y 10.', 'warning');
            return;
        }
        setSavingId(submission.id);
        try {
            await academicService.gradeSubmission(submission.id, { grade, status: 'Calificado' });
            showToast('Calificación guardada.', 'success');
            onGraded();
        } catch (err) {
            showToast(getApiErrorMessage(err, 'No se pudo guardar la calificación.'), 'error');
        } finally {
            setSavingId(null);
        }
    };

    const markInReview = async (submission: Submission) => {
        setSavingId(submission.id);
        try {
            await academicService.gradeSubmission(submission.id, { grade: Number(submission.grade ?? 0), status: 'En revisión' });
            onGraded();
        } catch (err) {
            showToast(getApiErrorMessage(err, 'No se pudo actualizar el estado.'), 'error');
        } finally {
            setSavingId(null);
        }
    };

    return { gradeValue, setGradeDraft, saveGrade, markInReview, savingId };
}
