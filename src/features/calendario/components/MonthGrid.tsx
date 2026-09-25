'use client';

import { WEEK_DAYS, ENTRY_STYLES, entriesOnDay, toIsoDate } from '../utils/calendarGrid';
import type { CalendarEntry } from '../types';

interface MonthGridProps {
    month: Date;
    grid: Date[];
    entries: CalendarEntry[];
    onEntryClick: (entry: CalendarEntry) => void;
    // Solo el admin: clic en un día vacío para crear un evento
    onDayClick?: (isoDate: string) => void;
}

const MAX_VISIBLE_ENTRIES = 3;

export function MonthGrid({ month, grid, entries, onEntryClick, onDayClick }: MonthGridProps) {
    const todayIso = toIsoDate(new Date());

    return (
        <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', minWidth: '320px' }}>
                {WEEK_DAYS.map((day) => (
                    <div key={day} style={{ padding: '0.5rem', fontFamily: 'Poppins', fontSize: '0.78rem', fontWeight: 600, color: '#888', textAlign: 'center' }}>
                        {day}
                    </div>
                ))}
                {grid.map((date) => {
                    const isoDate = toIsoDate(date);
                    const inMonth = date.getMonth() === month.getMonth();
                    const isToday = isoDate === todayIso;
                    const dayEntries = entriesOnDay(entries, isoDate);
                    const hiddenCount = dayEntries.length - MAX_VISIBLE_ENTRIES;
                    return (
                        <div
                            key={isoDate}
                            onClick={() => onDayClick?.(isoDate)}
                            className="cal-day"
                            style={{
                                minHeight: '96px', padding: '0.35rem', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)',
                                background: inMonth ? 'transparent' : 'var(--surface-soft)', cursor: onDayClick ? 'pointer' : 'default',
                                display: 'flex', flexDirection: 'column', gap: '0.2rem', minWidth: 0,
                            }}
                        >
                            <span style={{
                                alignSelf: 'flex-start', fontFamily: 'Poppins', fontSize: '0.78rem', fontWeight: isToday ? 700 : 500,
                                color: isToday ? '#fff' : inMonth ? 'var(--text)' : '#bbb',
                                background: isToday ? 'linear-gradient(135deg, #f97316, #e53e6d)' : 'transparent',
                                borderRadius: '999px', minWidth: '1.6rem', textAlign: 'center', padding: '0.1rem 0.35rem',
                            }}>
                                {date.getDate()}
                            </span>
                            {dayEntries.slice(0, MAX_VISIBLE_ENTRIES).map((entry) => {
                                const style = ENTRY_STYLES[entry.kind];
                                return (
                                    <button
                                        key={entry.key}
                                        type="button"
                                        title={entry.title}
                                        onClick={(event) => { event.stopPropagation(); onEntryClick(entry); }}
                                        className="cal-chip"
                                        style={{
                                            background: style.background, color: style.color, border: 'none', borderRadius: '6px',
                                            padding: '0.15rem 0.35rem', fontFamily: 'Poppins', fontSize: '0.7rem', fontWeight: 600,
                                            textAlign: 'left', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%',
                                        }}
                                    >
                                        <span className="cal-chip-text">{entry.title}</span>
                                    </button>
                                );
                            })}
                            {hiddenCount > 0 && (
                                <span style={{ fontFamily: 'Poppins', fontSize: '0.68rem', color: '#888' }}>+{hiddenCount} más</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function CalendarLegend() {
    return (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {Object.entries(ENTRY_STYLES).map(([kind, style]) => (
                <div key={kind} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: 12, height: 12, borderRadius: '4px', background: style.background, border: `2px solid ${style.color}` }} />
                    <span style={{ fontFamily: 'Poppins', fontSize: '0.78rem', color: 'var(--text-soft)' }}>{style.label}</span>
                </div>
            ))}
        </div>
    );
}
