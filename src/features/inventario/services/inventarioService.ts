import { API, TOKEN_KEYS } from "@/constants";
import { authFetch } from '@/api/authSession';
import type { Material, CreateMaterialPayload, UpdateMaterialPayload } from "../types";
import { unwrapList, unwrapResponse } from '@/utils/apiResponse';

function getAuthHeaders(includeContentType = true): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.access) : null;

    return {
        ...(includeContentType ? { 'Content-Type' : 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await authFetch(`${API}${endpoint}`, {
        ...options, headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    if (!response.ok){
        const errorBody = await response.json().catch(() => null);
        const detail = errorBody?.detail ?? `Error ${response.status}`;
        throw new Error (detail);
    }

    if (response.status === 204) return null as T;

    return response.json() as Promise<T>;
}

export const inventarioService = {
    getAll: async (): Promise<Material[]> => {
        const raw = await fetchWithAuth<unknown>('/materials/');
        return unwrapList<Material>(raw);
    },

    getById: async (id: number): Promise<Material> => {
        const raw = await fetchWithAuth<unknown>(`/materials/${id}/`);
        return unwrapResponse<Material>(raw);
    },

    create: async (payload: CreateMaterialPayload): Promise<Material> => {
        const raw = await fetchWithAuth<unknown>('/materials/', {
            method: 'POST',
            body:   JSON.stringify(payload),
        });
        return unwrapResponse<Material>(raw);
    },

    update: async (id: number, payload: UpdateMaterialPayload): Promise<Material> => {
        const raw = await fetchWithAuth<unknown>(`/materials/${id}/`, {
            method: 'PATCH',
            body:   JSON.stringify(payload),
        });
        return unwrapResponse<Material>(raw);
    },

    delete: async (id: number): Promise<void> => {
        await fetchWithAuth<unknown>(`/materials/${id}/`, { method: 'DELETE' });
    },
};

