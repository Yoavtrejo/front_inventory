import api from '@/api/axiosconfig';
import { unwrapList, unwrapResponse } from '@/utils/apiResponse';
import type { Carrera, CarreraPayload } from '../types';

// GET es público (lo usa el registro); escribir es solo del admin
export const carrerasService = {
    getAll: async (): Promise<Carrera[]> => {
        const response = await api.get('/carreras/');
        return unwrapList<Carrera>(response.data);
    },

    create: async (payload: CarreraPayload): Promise<Carrera> => {
        const response = await api.post('/carreras/', payload);
        return unwrapResponse<Carrera>(response.data);
    },

    update: async (id: number, payload: CarreraPayload): Promise<Carrera> => {
        const response = await api.patch(`/carreras/${id}/`, payload);
        return unwrapResponse<Carrera>(response.data);
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/carreras/${id}/`);
    },
};
