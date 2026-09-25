'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline, IoCalendarOutline, IoAdd, IoPencil } from 'react-icons/io5';
import { PageHeader, PRIMARY_BUTTON_STYLE, CARD_STYLE } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal/Modal';
import { useCalendario } from '../hooks/useCalendario';
import { useCalendarioAdmin } from '../hooks/useCalendarioAdmin';
import { MonthGrid, CalendarLegend } from './MonthGrid';
import { EventFormModal, TermFormModal } from './CalendarForms';
import { ENTRY_STYLES, capitalizeFirst, formatLongDate, monthLabel, toIsoDate } from '../utils/calendarGrid';
import type { CalendarEntry } from '../types';
import type { SessionRole } from '@/utils/session';

const NAV_BUTTON = { background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' } as const;

const SUBTITLES: Record<SessionRole, string> = {
    Administrador: 'Define las fechas del cuatrimestre y los eventos académicos. Da clic en un día para agregar un evento.',
    Docente: 'Fechas del cuatrimestre, eventos y las entregas de tus actividades.',
    Alumno: 'Fechas del cuatrimestre, eventos y las entregas de tus actividades.',
};

function dateRangeLabel(entry: CalendarEntry): string {
    return entry.startDate === entry.endDate
        ? formatLongDate(entry.startDate)
        : `Del ${formatLongDate(entry.startDate)} al ${formatLongDate(entry.endDate)}`;
}

export function Calendario({ role }: { role: SessionRole }) {
    const isAdmin = role === 'Administrador';
    const { month, grid, entries, activeTerm, events, loading, error, previousMonth, nextMonth, goToToday, reload } = useCalendario(role);
    const admin = useCalendarioAdmin(events, reload);
    const [selectedEntry, setSelectedEntry] = useState<CalendarEntry | null>(null);

    const handleEntryClick = (entry: CalendarEntry) => {
        if (isAdmin && entry.eventId) admin.openEditEvent(entry.eventId);
        else setSelectedEntry(entry);
    };

    const monthStart = toIsoDate(new Date(month.getFullYear(), month.getMonth(), 1));
    const monthEnd = toIsoDate(new Date(month.getFullYear(), month.getMonth() + 1, 0));
    const monthEntries = entries
        .filter((entry) => entry.startDate <= monthEnd && entry.endDate >= monthStart)
        .sort((first, second) => first.startDate.localeCompare(second.startDate));

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title="Calendario"
                subtitle={SUBTITLES[role]}
                action={isAdmin ? (
                    <button onClick={() => admin.openNewEvent(toIsoDate(new Date()))} style={{ ...PRIMARY_BUTTON_STYLE, width: '100%', maxWidth: '220px' }}>
                        <IoAdd size={18} /> Nuevo evento
                    </button>
                ) : undefined}
            />

            {error && <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>}

            <div style={{ ...CARD_STYLE, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <IoCalendarOutline size={22} color="#f97316" />
                    <div>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', margin: 0 }}>
                            {activeTerm ? `Cuatrimestre ${activeTerm.name}` : 'Sin cuatrimestre activo'}
                        </p>
                        <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0 }}>
                            {activeTerm?.start_date && activeTerm.end_date
                                ? `Del ${formatLongDate(activeTerm.start_date)} al ${formatLongDate(activeTerm.end_date)}`
                                : isAdmin ? 'Define el inicio y el fin para que todos los vean.' : 'La administración aún no publica las fechas.'}
                        </p>
                    </div>
                </div>
                {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {activeTerm && (
                            <button onClick={() => admin.openTermForm(activeTerm)} style={NAV_BUTTON}>
                                <IoPencil /> Editar fechas
                            </button>
                        )}
                        <button onClick={() => admin.openTermForm(null)} style={NAV_BUTTON}>
                            <IoAdd /> Nuevo cuatrimestre
                        </button>
                    </div>
                )}
            </div>

            <div style={{ ...CARD_STYLE, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <button onClick={previousMonth} style={NAV_BUTTON} aria-label="Mes anterior"><IoChevronBackOutline /> Anterior</button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>{monthLabel(month)}</span>
                        <button onClick={goToToday} style={{ ...NAV_BUTTON, padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}>Hoy</button>
                    </div>
                    <button onClick={nextMonth} style={NAV_BUTTON} aria-label="Mes siguiente">Siguiente <IoChevronForwardOutline /></button>
                </div>

                {loading ? (
                    <div style={{ height: '420px', borderRadius: '12px', background: 'var(--border)' }} />
                ) : (
                    <MonthGrid month={month} grid={grid} entries={entries} onEntryClick={handleEntryClick} onDayClick={isAdmin ? admin.openNewEvent : undefined} />
                )}
                <CalendarLegend />
            </div>

            <div style={{ ...CARD_STYLE, marginTop: '1rem' }}>
                <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.75rem' }}>
                    En {monthLabel(month).toLowerCase()}
                </h2>
                {monthEntries.length === 0 && <p style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: '#aaa' }}>No hay fechas marcadas este mes.</p>}
                {monthEntries.map((entry) => {
                    const style = ENTRY_STYLES[entry.kind];
                    return (
                        <button
                            key={entry.key}
                            type="button"
                            onClick={() => handleEntryClick(entry)}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', width: '100%', background: 'none', border: 'none', borderTop: '1px solid var(--border)', padding: '0.6rem 0', cursor: 'pointer', textAlign: 'left' }}
                        >
                            <span style={{ ...style, borderRadius: '6px', padding: '0.15rem 0.5rem', fontFamily: 'Poppins', fontSize: '0.72rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                {style.label}
                            </span>
                            <span style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text)' }}>
                                <strong>{entry.title}</strong>
                                <span style={{ display: 'block', color: 'var(--text-soft)', fontSize: '0.8rem' }}>{capitalizeFirst(dateRangeLabel(entry))}</span>
                            </span>
                        </button>
                    );
                })}
            </div>

            {selectedEntry && (
                <Modal open title={selectedEntry.title} onClose={() => setSelectedEntry(null)}>
                    <span style={{ ...ENTRY_STYLES[selectedEntry.kind], borderRadius: '6px', padding: '0.2rem 0.6rem', fontFamily: 'Poppins', fontSize: '0.78rem', fontWeight: 600 }}>
                        {ENTRY_STYLES[selectedEntry.kind].label}
                    </span>
                    <p style={{ fontFamily: 'Poppins', fontSize: '0.9rem', color: '#1a1a1a', margin: '0.75rem 0 0.25rem' }}>{capitalizeFirst(dateRangeLabel(selectedEntry))}</p>
                    {selectedEntry.description && <p style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: '#555' }}>{selectedEntry.description}</p>}
                    {selectedEntry.href && (
                        <Link href={selectedEntry.href} style={{ ...PRIMARY_BUTTON_STYLE, textDecoration: 'none', display: 'inline-flex', marginTop: '1rem' }}>
                            Ver actividad
                        </Link>
                    )}
                </Modal>
            )}

            {admin.eventForm && (
                <EventFormModal
                    form={admin.eventForm}
                    setForm={admin.setEventForm}
                    isEditing={admin.editingEventId !== null}
                    saving={admin.saving}
                    error={admin.formError}
                    onClose={admin.closeEventForm}
                    onSave={admin.saveEvent}
                    onDelete={admin.deleteEvent}
                />
            )}

            {admin.termForm && (
                <TermFormModal
                    form={admin.termForm}
                    setForm={admin.setTermForm}
                    isEditing={admin.editingTermId !== null}
                    saving={admin.saving}
                    error={admin.formError}
                    onClose={admin.closeTermForm}
                    onSave={admin.saveTerm}
                />
            )}
        </div>
    );
}
