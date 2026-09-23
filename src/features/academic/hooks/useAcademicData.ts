'use client';

import { useCallback, useEffect, useState } from 'react';
import { academicService } from '../services/academicService';
import { getSessionUserId } from '@/utils/session';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { ClassGroup, Activity, Submission, WorkTeam, StudentSummary } from '../types';

export type AcademicViewer = 'Docente' | 'Alumno';

interface AcademicData {
    userId: number | null;
    groups: ClassGroup[];
    joinableGroups: ClassGroup[];
    activities: Activity[];
    submissions: Submission[];
    teams: WorkTeam[];
    students: StudentSummary[];
}

const EMPTY_DATA: AcademicData = {
    userId: null, groups: [], joinableGroups: [], activities: [], submissions: [], teams: [], students: [],
};

function uniqueStudents(groups: ClassGroup[]): StudentSummary[] {
    const byId = new Map<number, StudentSummary>();
    groups.flatMap((group) => group.students_detail ?? []).forEach((student) => byId.set(student.id, student));
    return Array.from(byId.values());
}

// El backend ya filtra por rol: el docente recibe sus grupos y el alumno aquellos donde está inscrito
export function useAcademicData(viewer: AcademicViewer) {
    const [academicData, setAcademicData] = useState<AcademicData>(EMPTY_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isActive = true;

        Promise.all([
            academicService.getGroups(),
            academicService.getActivities(),
            academicService.getSubmissions(),
            academicService.getWorkTeams(),
            viewer === 'Alumno' ? academicService.getJoinableGroups() : Promise.resolve<ClassGroup[]>([]),
        ])
            .then(([groups, activities, submissions, teams, joinableGroups]) => {
                if (!isActive) return;
                setAcademicData({
                    userId: getSessionUserId(),
                    groups,
                    joinableGroups,
                    activities,
                    submissions,
                    teams,
                    students: uniqueStudents(groups),
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
