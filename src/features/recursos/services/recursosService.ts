import { isAxiosError } from 'axios';
import api from '@/api/axiosconfig';
import { unwrapList, unwrapResponse } from '@/utils/apiResponse';
import type { Recurso, CreateRecursoPayload } from '../types';

export const RECURSOS_ENDPOINT = '/resources/';

// Permite que la pantalla degrade con un aviso si el servidor no tiene el módulo
export function isEndpointMissing(error: unknown): boolean {
    return isAxiosError(error) && error.response?.status === 404;
}

export const recursosService = {
    getAll: async (): Promise<Recurso[]> => {
        const response = await api.get(RECURSOS_ENDPOINT);
        return unwrapList<Recurso>(response.data);
    },

    create: async (payload: CreateRecursoPayload): Promise<Recurso> => {
        const formData = new FormData();
        formData.append('title', payload.title);
        formData.append('description', payload.description);
        if (payload.file) formData.append('file', payload.file);

        const response = await api.post(RECURSOS_ENDPOINT, formData);
        return unwrapResponse<Recurso>(response.data);
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`${RECURSOS_ENDPOINT}${id}/`);
    },
};
