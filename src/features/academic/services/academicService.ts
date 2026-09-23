import api from '@/api/axiosconfig';
import { unwrapList, unwrapResponse } from '@/utils/apiResponse';
import type {
    ClassGroup, Activity, Submission, WorkTeam, StudentSummary, GroupAverage,
    CreateActivityPayload, CreateWorkTeamPayload, CreateSubmissionPayload, GradeSubmissionPayload,
} from '../types';

// Nota: los endpoints académicos no filtran por usuario; el filtrado se hace en utils/academicFilters.
export const academicService = {
    getGroups: async (): Promise<ClassGroup[]> => {
        const response = await api.get('/academic/classgroups/');
        return unwrapList<ClassGroup>(response.data);
    },

    getGroupById: async (id: number): Promise<ClassGroup> => {
        const response = await api.get(`/academic/classgroups/${id}/`);
        return unwrapResponse<ClassGroup>(response.data);
    },

    joinGroup: async (id: number): Promise<void> => {
        await api.post(`/academic/classgroups/${id}/join/`);
    },

    getGroupAverage: async (groupId: number, partial: number, studentId: number): Promise<GroupAverage> => {
        const response = await api.get(`/academic/classgroups/${groupId}/grades/${partial}/`, { params: { student_id: studentId } });
        return unwrapResponse<GroupAverage>(response.data);
    },

    getActivities: async (): Promise<Activity[]> => {
        const response = await api.get('/academic/activities/');
        return unwrapList<Activity>(response.data);
    },

    getActivityById: async (id: number): Promise<Activity> => {
        const response = await api.get(`/academic/activities/${id}/`);
        return unwrapResponse<Activity>(response.data);
    },

    createActivity: async (payload: CreateActivityPayload): Promise<Activity> => {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        formData.append('partial_period', String(payload.partial_period));
        formData.append('is_team_activity', String(payload.is_team_activity));
        formData.append('group', String(payload.group));
        if (payload.teacher_file) formData.append('teacher_file', payload.teacher_file);

        const response = await api.post('/academic/activities/', formData);
        return unwrapResponse<Activity>(response.data);
    },

    deleteActivity: async (id: number): Promise<void> => {
        await api.delete(`/academic/activities/${id}/`);
    },

    getSubmissions: async (): Promise<Submission[]> => {
        const response = await api.get('/academic/submissions/');
        return unwrapList<Submission>(response.data);
    },

    createSubmission: async (payload: CreateSubmissionPayload): Promise<Submission> => {
        const formData = new FormData();
        formData.append('activity', String(payload.activity));
        formData.append('student_file', payload.student_file);
        if (payload.work_team !== null) formData.append('work_team', String(payload.work_team));

        const response = await api.post('/academic/submissions/', formData);
        return unwrapResponse<Submission>(response.data);
    },

    replaceSubmissionFile: async (id: number, studentFile: File): Promise<Submission> => {
        const formData = new FormData();
        formData.append('student_file', studentFile);
        formData.append('status', 'Entregado');

        const response = await api.patch(`/academic/submissions/${id}/`, formData);
        return unwrapResponse<Submission>(response.data);
    },

    gradeSubmission: async (id: number, payload: GradeSubmissionPayload): Promise<Submission> => {
        const response = await api.patch(`/academic/submissions/${id}/`, payload);
        return unwrapResponse<Submission>(response.data);
    },

    getWorkTeams: async (): Promise<WorkTeam[]> => {
        const response = await api.get('/academic/workteams/');
        return unwrapList<WorkTeam>(response.data);
    },

    createWorkTeam: async (payload: CreateWorkTeamPayload): Promise<WorkTeam> => {
        const response = await api.post('/academic/workteams/', payload);
        return unwrapResponse<WorkTeam>(response.data);
    },

    deleteWorkTeam: async (id: number): Promise<void> => {
        await api.delete(`/academic/workteams/${id}/`);
    },

    // Solo staff (docente/admin) tiene permiso sobre /users/
    getStudents: async (): Promise<StudentSummary[]> => {
        const response = await api.get('/users/', { params: { is_staff: false } });
        return unwrapList<StudentSummary>(response.data);
    },
};
