import type { CalendarEntry, CalendarEntryKind } from '../types';

export const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] as const;

export const ENTRY_STYLES: Record<CalendarEntryKind, { background: string; color: string; label: string }> = {
    inicio:    { background: '#d1fae5', color: '#065f46', label: 'Inicio de cuatrimestre' },
    fin:       { background: '#fce7f3', color: '#9d174d', label: 'Fin de cuatrimestre' },
    actividad: { background: '#ffedd5', color: '#9a3412', label: 'Entrega de actividad' },
    examenes:  { background: '#ede9fe', color: '#5b21b6', label: 'Exámenes' },
    festivo:   { background: '#fee2e2', color: '#991b1b', label: 'Día festivo' },
    evento:    { background: '#dbeafe', color: '#1e40af', label: 'Evento' },
};

// 'YYYY-MM-DD' en hora local (toISOString usaría UTC)
export function toIsoDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isoDateFromDateTime(dateTime: string): string {
    return toIsoDate(new Date(dateTime));
}

export function monthLabel(month: Date): string {
    const label = month.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
}

// 6 semanas completas, empezando en lunes, que cubren el mes
export function buildMonthGrid(month: Date): Date[] {
    const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(month.getFullYear(), month.getMonth(), 1 - offset);
    return Array.from({ length: 42 }, (_, index) =>
        new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + index));
}

export function entriesOnDay(entries: CalendarEntry[], isoDate: string): CalendarEntry[] {
    return entries.filter((entry) => entry.startDate <= isoDate && isoDate <= entry.endDate);
}

export function formatLongDate(isoDate: string): string {
    const [year, month, day] = isoDate.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
