import { API, TOKEN_KEYS } from '@/constants';
import { unwrapList, unwrapResponse } from '@/utils/apiResponse';
import type { LoanHistory, ConditionReport } from '../types';
import type { MaterialLoan } from '@/features/dashboard/types';
import type { Reservacion } from '../types';

function getAuthHeaders (): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.access) : null;
    return {
        'Content-Type': 'application/json', 
        ...(token ? { Authorization: `Bearer ${token}`} : {}), 
    };
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}) : Promise<T> {
    const response = await fetch(`${API}${endpoint}`, {
        ...options, 
        headers: { ...getAuthHeaders(), ...options.headers },
    });

    if (response.status === 204) return null as T;
    return response.json() as Promise<T>;
}

export const reportesService = {
    getHistorial: async () : Promise<LoanHistory[]> => {
        const raw = await fetchWithAuth<unknown>('/history/');
        return unwrapList<LoanHistory>(raw);
    },

    getLoansWithReport: async() : Promise<MaterialLoan[]> => {
        const raw = await fetchWithAuth<unknown>('/material-loans/');
        const loans = Array.isArray(raw) ? raw : (raw as { data: MaterialLoan[] }).data ?? [];
        return loans.filter((l: MaterialLoan) => l.has_condition_report);
    },

    getConditionReport: async (loanId: number): Promise<ConditionReport> => {
        const raw = await fetchWithAuth<unknown>(
            `/material-loans/${loanId}/condition-report/`
        );
        return unwrapResponse<ConditionReport>(raw);
    },

    getReservaciones: async () : Promise<Reservacion[]> => {
        const raw = await fetchWithAuth<unknown>('/reservaciones/');
        return unwrapList<Reservacion>(raw);
    },

    getAllConditionReports: async (): Promise<ConditionReport[]> => {
        const raw = await fetchWithAuth<unknown>('/material-loans/condition-reports/');
        return unwrapList<ConditionReport>(raw);
    }
};