import { API, TOKEN_KEYS } from "@/constants/index";
import { authFetch } from '@/api/authSession';
import type { MaterialLoan, CreateLoanPayload, AuthorizeLoanPayload } from "@/features/prestamos/types";
import { unwrapList, unwrapResponse } from '@/utils/apiResponse';

function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.access) : null;
    return {
        'Content-Type' : 'application/json', 
        ...(token ? { Authorization : `Bearer ${token}`} : {}),
    };
}


async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await authFetch(`${API}${endpoint}`, {
        ...options,
        headers: { ...getAuthHeaders(), ...options.headers },
    });

    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
        throw new Error('Sesión expirada.');
    }

    if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message ?? errorBody?.detail ?? `Error ${response.status}`);
}

    if (response.status === 204) return null as T;

    const json = await response.json();
    return json as T;
}

    export const prestamoService = {
        getAll: async (): Promise<MaterialLoan[]> => {
            const raw = await fetchWithAuth<unknown>('/material-loans/');
            return unwrapList<MaterialLoan>(raw);
        },

        getById: async (id: number): Promise<MaterialLoan> => {
            const raw = await fetchWithAuth<unknown>(`/material-loans/${id}/`);
            return unwrapResponse<MaterialLoan>(raw);
        },

        create: async (payload: CreateLoanPayload): Promise<MaterialLoan> => {
            const raw = await fetchWithAuth<unknown>('/material-loans/', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            return unwrapResponse<MaterialLoan>(raw);
        },

        authorize: async (id: number, userId: number): Promise<MaterialLoan> => {
            const raw = await fetchWithAuth<unknown>(`/material-loans/${id}/`, {
                method: 'PATCH',
                body: JSON.stringify({ approved_by_user_id: userId }),
            });
            return unwrapResponse<MaterialLoan>(raw);
        },

        finalize: async (id: number): Promise<MaterialLoan> => {
            // Usamos FormData en lugar de JSON porque el endpoint maneja archivos
            const formData = new FormData();
            formData.append('description', 'Préstamo finalizado');
            // No mandamos foto — quedará null después del cambio en el modelo

            const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.access) : null;

            const response = await authFetch(`${API}/material-loans/${id}/condition-report/`, {
                method: 'POST',
                headers: {
                     // NO incluir Content-Type — el browser lo pone automáticamente con el boundary
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: formData,
            });

            if (response.status === 401) {
                if (typeof window !== 'undefined') window.location.href = '/login';
                throw new Error('Sesión expirada');
            }

            if (!response.ok) {
                const errorBody = await response.json().catch(() => null);
                throw new Error(errorBody?.message ?? errorBody?.detail ?? `Error ${response.status}`);
            }

            // condition-report devuelve el reporte, no el préstamo
            // necesitamos refetch del préstamo actualizado
            const loanRaw = await fetchWithAuth<unknown>(`/material-loans/${id}/`);
            return unwrapResponse<MaterialLoan>(loanRaw);
        },

        // El backend devuelve el stock al rechazar, cancelar, finalizar o eliminar
        reject: async (id: number): Promise<MaterialLoan> => {
            const raw = await fetchWithAuth<unknown>(`/material-loans/${id}/reject/`, { method: 'POST' });
            return unwrapResponse<MaterialLoan>(raw);
        },

        cancel: async (id: number): Promise<MaterialLoan> => {
            const raw = await fetchWithAuth<unknown>(`/material-loans/${id}/cancel/`, { method: 'POST' });
            return unwrapResponse<MaterialLoan>(raw);
        },

        delete: async (id: number): Promise<void> => {
            await fetchWithAuth<unknown>(`/material-loans/${id}/`, { method: 'DELETE' });
        },
};
