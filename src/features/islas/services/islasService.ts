import { API, TOKEN_KEYS } from '@/constants';
import { authFetch } from '@/api/authSession';
import { unwrapList, unwrapResponse } from '@/utils/apiResponse';
import type { Isla, Reservacion, Ocupacion, CreateIslaPayload, UpdateIslaPayload, CreateReservacionPayload, HorarioBloqueado, CreateHorarioBloqueadoPayload } from '../types';

function getAuthHeaders() : HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.access) : null;
    return {
        'Content-Type' : 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

async function readErrorBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

async function fetchWithAuth<T>(endpoint:string, options: RequestInit = {}) : Promise<T> {
    const response = await authFetch(`${API}${endpoint}`, {
        ...options,
        headers: { ...getAuthHeaders(), ...options.headers },
    });

    if (response.status === 401){
        if (typeof window !== 'undefined') window.location.href = '/login';
        throw new Error('Sesiòn expirada.');
    }

    if (!response.ok) {
        const errorBody = await readErrorBody(response);
        const detail = typeof errorBody === 'string'
            ? errorBody
            : errorBody && typeof errorBody === 'object' && 'detail' in errorBody
                ? String((errorBody as { detail?: unknown }).detail ?? '')
                : errorBody && typeof errorBody === 'object' && 'message' in errorBody
                    ? String((errorBody as { message?: unknown }).message ?? '')
                    : `Error ${response.status}`;

        throw new Error(detail || `Error ${response.status}`);
    }

    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
}

export const islasService = {
    getAll: async() : Promise<Isla[]> => {
        const raw = await fetchWithAuth<unknown>(`/islas/`);
        return unwrapList<Isla>(raw);
    },

    getById: async(id: number) : Promise<Isla> => {
        const raw = await fetchWithAuth<unknown>(`/islas/${id}/`);
        return unwrapResponse<Isla>(raw);
    },

    create: async (payload: CreateIslaPayload) : Promise<Isla> => {
        const raw = await fetchWithAuth<unknown>(`/islas/`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return unwrapResponse<Isla>(raw);
    },

    update: async (id: number, payload: UpdateIslaPayload) : Promise<Isla> => {
        const raw = await fetchWithAuth<unknown>(`/islas/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
        return unwrapResponse<Isla>(raw);
    },

    delete: async (id: number) : Promise<void> => {
        await fetchWithAuth<unknown>(`/islas/${id}/`, {
            method: 'DELETE'
        });
    },

    getReservaciones: async() : Promise<Reservacion[]> => {
        const raw = await fetchWithAuth<unknown>('/reservaciones/');
        return unwrapList<Reservacion>(raw);
    },
    // Reservaciones de todos (sin datos personales) para pintar horarios ocupados
    getOcupacion: async (desde: string, hasta: string): Promise<Ocupacion[]> => {
        const raw = await fetchWithAuth<unknown>(`/reservaciones/ocupacion/?desde=${desde}&hasta=${hasta}`);
        return unwrapList<Ocupacion>(raw);
    },

    createReservacion: async(payload: CreateReservacionPayload) : Promise<Reservacion> => {
        const raw = await fetchWithAuth<unknown>('/reservaciones/', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return unwrapResponse<Reservacion>(raw);
    },

    cancelarReservacion: async (id:number): Promise<Reservacion> => {
        const raw = await fetchWithAuth<unknown>(`/reservaciones/${id}/cancelar/`, {
            method: 'POST',
        });
        return unwrapResponse<Reservacion>(raw);
    },

    deleteReservacion: async (id:number) : Promise<void> => {
        await fetchWithAuth<unknown>(`/reservaciones/${id}/`, {
            method:'DELETE'
        });
    },

    getHorariosBloquedos: async (): Promise<HorarioBloqueado[]> => {
        const raw = await fetchWithAuth<unknown>('/horarios-bloqueados/');
        return unwrapList<HorarioBloqueado>(raw); 
    },

    createHorarioBloqueado: async( payload: CreateHorarioBloqueadoPayload ) : Promise<HorarioBloqueado> => {
        const raw = await fetchWithAuth<unknown>('/horarios-bloqueados/', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return unwrapResponse<HorarioBloqueado>(raw);
    },
    
    deleteHorarioBloqueado: async(id: number): Promise<void> => {
        await fetchWithAuth<unknown>(`/horarios-bloqueados/${id}/`, {
            method: 'DELETE',
        });
    },
};