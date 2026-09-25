'use client';

import { useState } from 'react';
import { calendarService } from '../services/calendarService';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { CalendarEvent, CalendarEventKind, Term } from '../types';

export interface EventForm {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    kind: CalendarEventKind;
}

export interface TermForm {
    name: string;
    start_date: string;
    end_date: string;
}

const EMPTY_EVENT: EventForm = { title: '', description: '', start_date: '', end_date: '', kind: 'evento' };

export function useCalendarioAdmin(events: CalendarEvent[], onSaved: () => void) {
    const { showToast } = useToast();
    const [eventForm, setEventForm] = useState<EventForm | null>(null);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [termForm, setTermForm] = useState<TermForm | null>(null);
    const [editingTermId, setEditingTermId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const openNewEvent = (isoDate: string) => {
        setEventForm({ ...EMPTY_EVENT, start_date: isoDate });
        setEditingEventId(null);
        setFormError(null);
    };

    const openEditEvent = (eventId: number) => {
        const event = events.find((candidate) => candidate.id === eventId);
        if (!event) return;
        setEventForm({ title: event.title, description: event.description, start_date: event.start_date, end_date: event.end_date ?? '', kind: event.kind });
        setEditingEventId(eventId);
        setFormError(null);
    };

    const closeEventForm = () => setEventForm(null);

    const saveEvent = async () => {
        if (!eventForm) return;
        if (!eventForm.title.trim() || !eventForm.start_date) {
            setFormError('El título y la fecha de inicio son obligatorios.');
            return;
        }
        if (eventForm.end_date && eventForm.end_date < eventForm.start_date) {
            setFormError('La fecha final no puede ser anterior a la inicial.');
            return;
        }
        setSaving(true);
        setFormError(null);
        const payload = { ...eventForm, title: eventForm.title.trim(), end_date: eventForm.end_date || null };
        try {
            if (editingEventId) await calendarService.updateEvent(editingEventId, payload);
            else await calendarService.createEvent(payload);
            showToast('Evento guardado.', 'success');
            setEventForm(null);
            onSaved();
        } catch (err) {
            setFormError(getApiErrorMessage(err, 'No se pudo guardar el evento.'));
        } finally {
            setSaving(false);
        }
    };

    const deleteEvent = async () => {
        if (!editingEventId) return;
        setSaving(true);
        try {
            await calendarService.deleteEvent(editingEventId);
            showToast('Evento eliminado.', 'success');
            setEventForm(null);
            onSaved();
        } catch (err) {
            setFormError(getApiErrorMessage(err, 'No se pudo eliminar el evento.'));
        } finally {
            setSaving(false);
        }
    };

    const openTermForm = (term: Term | null) => {
        setTermForm(term
            ? { name: term.name, start_date: term.start_date ?? '', end_date: term.end_date ?? '' }
            : { name: '', start_date: '', end_date: '' });
        setEditingTermId(term?.id ?? null);
        setFormError(null);
    };

    const closeTermForm = () => setTermForm(null);

    // El cuatrimestre que se guarda aquí queda como el activo
    const saveTerm = async () => {
        if (!termForm) return;
        if (!termForm.name.trim() || !termForm.start_date || !termForm.end_date) {
            setFormError('El nombre, el inicio y el fin son obligatorios.');
            return;
        }
        if (termForm.end_date <= termForm.start_date) {
            setFormError('El fin debe ser posterior al inicio.');
            return;
        }
        setSaving(true);
        setFormError(null);
        const payload = { name: termForm.name.trim(), start_date: termForm.start_date, end_date: termForm.end_date, is_active: true };
        try {
            if (editingTermId) await calendarService.updateTerm(editingTermId, payload);
            else await calendarService.createTerm(payload);
            showToast('Cuatrimestre guardado.', 'success');
            setTermForm(null);
            onSaved();
        } catch (err) {
            setFormError(getApiErrorMessage(err, 'No se pudo guardar el cuatrimestre.'));
        } finally {
            setSaving(false);
        }
    };

    return {
        eventForm, setEventForm, editingEventId, openNewEvent, openEditEvent, closeEventForm, saveEvent, deleteEvent,
        termForm, setTermForm, editingTermId, openTermForm, closeTermForm, saveTerm,
        saving, formError,
    };
}
