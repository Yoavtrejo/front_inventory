import { API, TOKEN_KEYS } from "@/constants";
import { unwrapList, unwrapResponse } from "@/utils/apiResponse";
import type { ClassGroup, Activity, Submission, CreateActivityPayload, UpdateSubmissionPayload } from "@/features/docente/types";
import { Usuario } from "@/features/permisos";

function getAuthHeaders():HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.access) : null;
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}) : Promise<T> {
    const response = await fetch(`${API}${endpoint}`, {
        ...options,
        headers: { ...getAuthHeaders(), ...options.headers },
    });

    if (response.status === 401) {
        if (typeof window !== 'undefined') window.location.href = '/login';
        throw new Error('Sesión expirada');
    }
    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody.detail ?? `Error ${response.status}`);
    }

    if (response.status === 204 ) return null as T;
    return response.json() as Promise<T>;
}

export const docenteService = {
    getGrupos: async (id:number):Promise<ClassGroup[]> =>{
        const raw = await fetchWithAuth<unknown>('/academic/classgroups/');
        return unwrapList<ClassGroup>(raw);
    },

    getGrupoById: async (id: number): Promise<ClassGroup> => {
        const raw = await fetchWithAuth<unknown>(`/academic/classgroups/${id}/`);
        return unwrapResponse<ClassGroup>(raw);
    },

    getActividades: async ():Promise<Activity[]> => {
        const raw = await fetchWithAuth<unknown>('/academic/activities/');
        return unwrapList<Activity>(raw);
    },

    createActividad: async (payload: CreateActivityPayload) : Promise<Activity> => {
        const raw = await fetchWithAuth<unknown>('/academic/activities/', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return unwrapResponse<Activity>(raw);
    },

    deleteActividad: async (id: number): Promise<void> => {
        await fetchWithAuth<unknown>(`/academic/activities/${id}/`, {
            method: 'DELETE',
        });
    },

    getSubmissions: async (): Promise<Submission[]> => {
        const raw = await fetchWithAuth<unknown>('/academic/submissions/');
        return unwrapList<Submission>(raw);
    },

    getSubmissionsByActivity: async (activityId: number): Promise<Submission[]> => {
        const raw = await fetchWithAuth<unknown>(`/academic/submissions/?activity=${activityId}` );
        return unwrapList<Submission>(raw);
    },

    updateSubmission: async (id: number, payload: UpdateSubmissionPayload): Promise<Submission> => {
        const raw = await fetchWithAuth<unknown>(`/academic/submissions/${id}/`, {
            method: 'PATCH',
            body:   JSON.stringify(payload),
        });
        return unwrapResponse<Submission>(raw);
    },

    getGradesByGroup: async (groupId: number, partial: string = 'final'): Promise<unknown> => {
        const raw = await fetchWithAuth<unknown>(`/academic/classgroups/${groupId}/grades/${partial}/`);
        return unwrapResponse<unknown>(raw);
    },

    getUsuarioById: async (id: number): Promise<Usuario> => {
        const raw = await fetchWithAuth<unknown>(`/users/${id}/`);
        return unwrapResponse<Usuario>(raw);
    },

    getEstudiantesDeGrupo: async (studentIds: number[]): Promise<Usuario[]> => {
        if (studentIds.length === 0) return [];
            const resultados = await Promise.allSettled(
                studentIds.map((id) => fetchWithAuth<unknown>(`/users/${id}/`).then((r) => unwrapResponse<Usuario>(r))
            )
        );
        return resultados.filter((r): r is PromiseFulfilledResult<Usuario> => r.status === 'fulfilled').map((r) => r.value);
    },
}