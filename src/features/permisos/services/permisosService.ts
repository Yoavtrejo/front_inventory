import { API, TOKEN_KEYS } from '@/constants';
import { unwrapList, unwrapResponse } from '@/utils/apiResponse';
import type { Usuario, CreateUsuarioPayload, UpdateUsuarioPayload } from '../types';

function getAuthHeaders() : HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.access) : null;
    return {
        'Content-Type' : 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), 
    };
} 

async function fetchWithAuth<T>(endpoint:string, options: RequestInit = {}):Promise<T> {
    const response = await fetch(`${API}${endpoint}`, {
        ...options, 
        headers: { ...getAuthHeaders(), ...options.headers },
    });

    if (response.status === 401) {
        if (typeof window !== 'undefined') window.location.href = '/login';
        throw new Error('Sesión expirada. Redirigiendo a la página de inicio de sesión.');
    }

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.detail ?? `Error ${response.status}: ${response.statusText}`);
    }

    if(response.status === 204) return null as T;
    return response.json() as Promise<T>;
}

export const permisosService = {
    getAll: async () : Promise<Usuario[]> => {
        const raw = await fetchWithAuth<unknown>('/users/');
        return unwrapList<Usuario>(raw);
    },

    getById : async (id: number) : Promise<Usuario> => {
        const raw = await fetchWithAuth<unknown>(`/users/${id}/`);
        return unwrapResponse<Usuario>(raw);
    },

    create: async (payload: CreateUsuarioPayload): Promise<Usuario> => {
        const raw = await fetchWithAuth<unknown>('/users/', {
            method:'POST',
            body: JSON.stringify(payload),
        });
        return unwrapResponse<Usuario>(raw);
    },

    update: async(id: number, payload:UpdateUsuarioPayload) : Promise<Usuario> => {
        const raw = await fetchWithAuth<unknown>(`/users/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
        return unwrapResponse<Usuario>(raw);
    },

    delete: async(id:number): Promise<void> => {
        await fetchWithAuth<unknown>(`/users/${id}/`, {
            method:'DELETE'
        });
    }
}