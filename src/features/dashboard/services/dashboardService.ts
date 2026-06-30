// src/features/dashboard/services/dashboardService.ts
import { API, TOKEN_KEYS } from '@/constants';
import type { Reservacion, MaterialLoan, Isla } from '../types';

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.access) : null;

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

function normalizeList<T>(data: unknown): T[] {
    if (Array.isArray(data)) return data as T[];
    if (data && typeof data === 'object' && 'results' in data) {
        return (data as { results: T[] }).results ?? [];
    }
    return [];
}

async function fetchWithAuth<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API}${endpoint}`, {
        method:  'GET',
        headers: getAuthHeaders(),
    });

    if (response.status === 401) {
        if (typeof window !== 'undefined') window.location.href = '/login';
        throw new Error('Sesión expirada');
    }

    if (!response.ok) {
        throw new Error(`Error ${response.status} en ${endpoint}`);
    }

    return response.json() as Promise<T>;
}

export const dashboardService = {
    getReservaciones: async (): Promise<Reservacion[]> => {
        const data = await fetchWithAuth<unknown>('/reservaciones/');
        return normalizeList<Reservacion>(data);
    },

    getPrestamos: async (): Promise<MaterialLoan[]> => {
        const data = await fetchWithAuth<unknown>('/material-loans/');
        return normalizeList<MaterialLoan>(data);
    },

    getIslas: async (): Promise<Isla[]> => {
        const data = await fetchWithAuth<unknown>('/islas/');
        return normalizeList<Isla>(data);
    },
};