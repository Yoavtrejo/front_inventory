'use client';

import { useState } from 'react';
import { academicService, findStudentSubmission, findStudentTeam } from '@/features/academic';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { Activity, Submission, WorkTeam } from '@/features/academic';

interface EntregasContext {
    userId: number | null;
    submissions: Submission[];
    teams: WorkTeam[];
    onSubmitted: () => void;
}

export function useEntregas({ userId, submissions, teams, onSubmitted }: EntregasContext) {
    const { showToast } = useToast();
    const [pendingFiles, setPendingFiles] = useState<Record<number, File>>({});
    const [uploadActivity, setUploadActivity] = useState<Activity | null>(null);
    const [draftFile, setDraftFile] = useState<File | null>(null);
    const [submittingId, setSubmittingId] = useState<number | null>(null);

    const submissionFor = (activity: Activity): Submission | undefined =>
        userId === null ? undefined : findStudentSubmission(submissions, activity, userId, teams);

    const openUpload = (activity: Activity) => {
        setUploadActivity(activity);
        setDraftFile(pendingFiles[activity.id] ?? null);
    };

    const closeUpload = () => setUploadActivity(null);

    const confirmUpload = () => {
        if (!uploadActivity) return;
        if (!draftFile) {
            showToast('Selecciona un archivo.', 'warning');
            return;
        }
        setPendingFiles((prev) => ({ ...prev, [uploadActivity.id]: draftFile }));
        setUploadActivity(null);
    };

    const deliver = async (activity: Activity) => {
        const file = pendingFiles[activity.id];
        if (!file || userId === null) return;

        const team = activity.is_team_activity ? findStudentTeam(teams, activity.group, userId) : undefined;
        if (activity.is_team_activity && !team) {
            showToast('Esta actividad es en equipo y aún no perteneces a uno. Consulta a tu docente.', 'warning');
            return;
        }

        setSubmittingId(activity.id);
        try {
            const existing = submissionFor(activity);
            if (existing) await academicService.replaceSubmissionFile(existing.id, file);
            else await academicService.createSubmission({ activity: activity.id, student_file: file, work_team: team?.id ?? null });

            setPendingFiles((prev) => {
                const next = { ...prev };
                delete next[activity.id];
                return next;
            });
            showToast('Actividad entregada.', 'success');
            onSubmitted();
        } catch (err) {
            showToast(getApiErrorMessage(err, 'No se pudo entregar la actividad.'), 'error');
        } finally {
            setSubmittingId(null);
        }
    };

    return { pendingFiles, submissionFor, uploadActivity, draftFile, setDraftFile, openUpload, closeUpload, confirmUpload, deliver, submittingId };
}
