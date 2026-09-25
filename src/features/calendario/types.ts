export interface Term {
    id: number;
    name: string;
    description: string;
    start_date: string | null;
    end_date: string | null;
    is_active: boolean;
}

export type CalendarEventKind = 'festivo' | 'examenes' | 'evento';

export interface CalendarEvent {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string | null;
    kind: CalendarEventKind;
    term: number | null;
    created_at: string;
}

export interface CalendarEventPayload {
    title: string;
    description: string;
    start_date: string;
    end_date: string | null;
    kind: CalendarEventKind;
}

export interface TermPayload {
    name: string;
    start_date: string | null;
    end_date: string | null;
    is_active: boolean;
}

// Todo lo que se pinta en el calendario, normalizado
export type CalendarEntryKind = 'inicio' | 'fin' | 'actividad' | CalendarEventKind;

export interface CalendarEntry {
    key: string;
    kind: CalendarEntryKind;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    href?: string;
    eventId?: number;
}
