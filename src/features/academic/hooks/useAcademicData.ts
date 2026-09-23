'use client';

import { useCallback, useEffect, useState } from 'react';
import { academicService } from '../services/academicService';
import {
    groupsTaughtBy, groupsOfStudent, activitiesOfGroups, submissionsOfActivities,
} from '../utils/academicFilters';
import { getSessionUserId } from '@/utils/session';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { ClassGroup, Activity, Submission, WorkTeam, StudentSummary } from '../types';

export type AcademicViewer = 'Docente' | 'Alumno';

interface AcademicData {
    userId: number | null;
    groups: ClassGroup[];
    allGroups: ClassGroup[];
    activities: Activity[];
    submissions: Submission[];
    teams: WorkTeam[];
    students: StudentSummary[];
}

const EMPTY_DATA: AcademicData = {
    userId: null, groups: [], allGroups: [], activities: [], submissions: [], teams: [], students: [],
};

// Carga la información académica visible para el usuario en sesión
export function useAcademicData(viewer: AcademicViewer) {
    const [academicData, setAcademicData] = useState<AcademicData>(EMPTY_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isActive = true;
        const userId = getSessionUserId();

        Promise.all([
            academicService.getGroups(),
            academicService.getActivities(),
            academicService.getSubmissions(),
            academicService.getWorkTeams(),
            viewer === 'Docente' ? academicService.getStudents() : Promise.resolve<StudentSummary[]>([]),
        ])
            .then(([allGroups, allActivities, allSubmissions, teams, students]) => {
                if (!isActive) return;
                const groups = viewer === 'Docente' ? groupsTaughtBy(allGroups, userId) : groupsOfStudent(allGroups, userId);
                const activities = activitiesOfGroups(allActivities, groups);
                setAcademicData({
                    userId,
                    groups,
                    allGroups,
                    activities,
                    submissions: submissionsOfActivities(allSubmissions, activities),
                    teams: teams.filter((team) => groups.some((group) => group.id === team.group)),
                    students,
                });
                setError(null);
            })
            .catch((err: unknown) => {
                if (isActive) setError(getApiErrorMessage(err, 'No se pudo cargar la información académica.'));
            })
            .finally(() => {
                if (isActive) setLoading(false);
            });

        return () => { isActive = false; };
    }, [viewer, reloadKey]);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return { ...academicData, loading, error, reload };
}
