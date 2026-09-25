'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { calendarService } from '../services/calendarService';
import { academicService } from '@/features/academic';
import { getApiErrorMessage } from '@/utils/apiResponse';
import { buildMonthGrid, isoDateFromDateTime, toIsoDate } from '../utils/calendarGrid';
import type { Activity, ClassGroup } from '@/features/academic';
import type { CalendarEntry, CalendarEvent, Term } from '../types';
import type { SessionRole } from '@/utils/session';

interface AcademicSnapshot {
    activities: Activity[];
    groups: ClassGroup[];
}

function activityHref(viewer: SessionRole, activity: Activity): string | undefined {
    if (viewer === 'Docente') return `/docente/actividades/${activity.id}`;
    if (viewer === 'Alumno') return '/alumno/actividades';
    return undefined;
}

function buildEntries(viewer: SessionRole, terms: Term[], events: CalendarEvent[], academic: AcademicSnapshot): CalendarEntry[] {
    const termEntries = terms.flatMap((term): CalendarEntry[] => [
        ...(term.start_date ? [{ key: `inicio-${term.id}`, kind: 'inicio' as const, title: `Inicio del cuatrimestre ${term.name}`, description: term.description, startDate: term.start_date, endDate: term.start_date }] : []),
        ...(term.end_date ? [{ key: `fin-${term.id}`, kind: 'fin' as const, title: `Fin del cuatrimestre ${term.name}`, description: term.description, startDate: term.end_date, endDate: term.end_date }] : []),
    ]);

    const eventEntries = events.map((event): CalendarEntry => ({
        key: `evento-${event.id}`,
        kind: event.kind,
        title: event.title,
        description: event.description,
        startDate: event.start_date,
        endDate: event.end_date ?? event.start_date,
        eventId: event.id,
    }));

    // Las actividades aparecen solas en su fecha de entrega
    const activityEntries = academic.activities
        .filter((activity) => activity.due_date !== null)
        .map((activity): CalendarEntry => {
            const dueDate = activity.due_date as string;
            const group = academic.groups.find((candidate) => candidate.id === activity.group);
            const hour = new Date(dueDate).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            return {
                key: `actividad-${activity.id}`,
                kind: 'actividad',
                title: activity.title,
                description: `${group ? `${group.subject_name} · Grupo ${group.name} · ` : ''}Parcial ${activity.partial_period} · Entrega hasta las ${hour}`,
                startDate: isoDateFromDateTime(dueDate),
                endDate: isoDateFromDateTime(dueDate),
                href: activityHref(viewer, activity),
            };
        });

    return [...termEntries, ...eventEntries, ...activityEntries];
}

export function useCalendario(viewer: SessionRole) {
    const [month, setMonth] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), today.getMonth(), 1);
    });
    const [terms, setTerms] = useState<Term[]>([]);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [academic, setAcademic] = useState<AcademicSnapshot>({ activities: [], groups: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const grid = useMemo(() => buildMonthGrid(month), [month]);
    const rangeStart = toIsoDate(grid[0]);
    const rangeEnd = toIsoDate(grid[grid.length - 1]);

    // Cuatrimestres y actividades no dependen del mes visible
    useEffect(() => {
        let isActive = true;
        Promise.all([
            calendarService.getTerms(),
            viewer === 'Administrador'
                ? Promise.resolve<AcademicSnapshot>({ activities: [], groups: [] })
                : Promise.all([academicService.getActivities(), academicService.getGroups()])
                    .then(([activities, groups]) => ({ activities, groups })),
        ])
            .then(([termList, snapshot]) => {
                if (!isActive) return;
                setTerms(termList);
                setAcademic(snapshot);
            })
            .catch((err: unknown) => {
                if (isActive) setError(getApiErrorMessage(err, 'No se pudo cargar el calendario.'));
            })
            .finally(() => {
                if (isActive) setLoading(false);
            });
        return () => { isActive = false; };
    }, [viewer, reloadKey]);

    useEffect(() => {
        let isActive = true;
        calendarService.getEvents(rangeStart, rangeEnd)
            .then((eventList) => { if (isActive) setEvents(eventList); })
            .catch(() => { if (isActive) setEvents([]); });
        return () => { isActive = false; };
    }, [rangeStart, rangeEnd, reloadKey]);

    const entries = useMemo(() => buildEntries(viewer, terms, events, academic), [viewer, terms, events, academic]);
    const activeTerm = terms.find((term) => term.is_active) ?? null;

    const previousMonth = () => setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const nextMonth = () => setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    const goToToday = () => {
        const today = new Date();
        setMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    };
    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return { month, grid, entries, terms, activeTerm, events, loading, error, previousMonth, nextMonth, goToToday, reload };
}
