import api from '@/api/axiosconfig';
import { unwrapList, unwrapResponse } from '@/utils/apiResponse';
import type { Term, TermPayload, CalendarEvent, CalendarEventPayload } from '../types';

export const calendarService = {
    getTerms: async (): Promise<Term[]> => {
        const response = await api.get('/academic/terms/');
        return unwrapList<Term>(response.data);
    },

    createTerm: async (payload: TermPayload): Promise<Term> => {
        const response = await api.post('/academic/terms/', payload);
        return unwrapResponse<Term>(response.data);
    },

    updateTerm: async (id: number, payload: Partial<TermPayload>): Promise<Term> => {
        const response = await api.patch(`/academic/terms/${id}/`, payload);
        return unwrapResponse<Term>(response.data);
    },

    getEvents: async (desde: string, hasta: string): Promise<CalendarEvent[]> => {
        const response = await api.get('/calendar-events/', { params: { desde, hasta } });
        return unwrapList<CalendarEvent>(response.data);
    },

    createEvent: async (payload: CalendarEventPayload): Promise<CalendarEvent> => {
        const response = await api.post('/calendar-events/', payload);
        return unwrapResponse<CalendarEvent>(response.data);
    },

    updateEvent: async (id: number, payload: CalendarEventPayload): Promise<CalendarEvent> => {
        const response = await api.patch(`/calendar-events/${id}/`, payload);
        return unwrapResponse<CalendarEvent>(response.data);
    },

    deleteEvent: async (id: number): Promise<void> => {
        await api.delete(`/calendar-events/${id}/`);
    },
};
