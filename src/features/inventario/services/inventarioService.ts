import { API, TOKEN_KEYS } from "@/constants";
import type { Material, CreateMaterialPayload, UpdateMaterialPayload } from "../types";

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
    const response = await fetch(`${API}${endpoint}`, {
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
        const data = await fetchWithAuth<Material[] | unknown>('/materials/');
        if (Array.isArray(data)) return data;
        return [];
    },

    //Obtener un material
    getById: async (id:number): Promise<Material> => fetchWithAuth<Material>(`/materials/${id}/`),

    //crear
    create: async (payload: CreateMaterialPayload) : Promise<Material> => fetchWithAuth<Material>('/materials/', {
        method: 'POST',
        body: JSON.stringify(payload),
    }),

    //editar
    update: async (id:number, payload: UpdateMaterialPayload) : Promise<Material> => fetchWithAuth<Material>(`/materials/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
    }),

    //eliminar
    delete: async (id:number) : Promise<void> => fetchWithAuth<void>(`/materials/${id}/`, {
        method: 'DELETE'
    }),
};