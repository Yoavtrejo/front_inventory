import { API, TOKEN_KEYS } from '@/constants/index';
import { unwrapResponse } from '@/utils/apiResponse';
import type { Perfil, UpdatePerfilPayload } from '../types';

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.access) : null;
    return {
        'Content-Type' : 'application/json', 
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
        throw new Error(errorBody?.detail ?? `Error ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export const perfilService = {
    get: async (): Promise<Perfil> => {
        const raw = await fetchWithAuth<unknown>('/profile/');
        return unwrapResponse<Perfil>(raw);
    },

    update: async (payload: UpdatePerfilPayload): Promise<Perfil> => {
        const raw = await fetchWithAuth<unknown>('/profile/', {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
        return unwrapResponse<Perfil>(raw);
    },
};