'use client';

import { Modal } from '@/components/ui/Modal/Modal';
import { ModalCancelButton, ModalSubmitButton } from '@/components/ui/Modal/ModalButtons';
import type { Dispatch, SetStateAction } from 'react';
import type { EventForm, TermForm } from '../hooks/useCalendarioAdmin';
import type { CalendarEventKind } from '../types';

const LABEL = { fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '0.35rem' } as const;
const INPUT = { fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' } as const;

const KIND_OPTIONS: Array<{ value: CalendarEventKind; label: string }> = [
    { value: 'evento', label: 'Evento' },
    { value: 'examenes', label: 'Exámenes' },
    { value: 'festivo', label: 'Día festivo / sin clases' },
];

interface EventFormModalProps {
    form: EventForm;
    setForm: Dispatch<SetStateAction<EventForm | null>>;
    isEditing: boolean;
    saving: boolean;
    error: string | null;
    onClose: () => void;
    onSave: () => void;
    onDelete: () => void;
}

export function EventFormModal({ form, setForm, isEditing, saving, error, onClose, onSave, onDelete }: EventFormModalProps) {
    const update = <K extends keyof EventForm>(field: K, value: EventForm[K]) =>
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev));

    return (
        <Modal
            open
            title={isEditing ? 'Editar evento' : 'Nuevo evento'}
            onClose={onClose}
            footer={(
                <>
                    {isEditing && (
                        <button type="button" onClick={onDelete} disabled={saving} className="button" style={{ fontFamily: 'Poppins', borderRadius: '8px', color: '#e53e6d', marginRight: 'auto' }}>
                            Eliminar
                        </button>
                    )}
                    <ModalCancelButton onClick={onClose} />
                    <ModalSubmitButton onClick={onSave} loading={saving} />
                </>
            )}
        >
            <div style={{ marginBottom: '0.75rem' }}>
                <label style={LABEL}>Título:</label>
                <input className="input" value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Ej. Semana de exámenes parciales" style={INPUT} />
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
                <label style={LABEL}>Tipo:</label>
                <div className="select is-fullwidth">
                    <select value={form.kind} onChange={(e) => update('kind', e.target.value as CalendarEventKind)} style={INPUT}>
                        {KIND_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                    <label style={LABEL}>Desde:</label>
                    <input className="input" type="date" value={form.start_date} onChange={(e) => update('start_date', e.target.value)} style={INPUT} />
                </div>
                <div>
                    <label style={LABEL}>Hasta (opcional):</label>
                    <input className="input" type="date" min={form.start_date} value={form.end_date} onChange={(e) => update('end_date', e.target.value)} style={INPUT} />
                </div>
            </div>
            <div>
                <label style={LABEL}>Descripción (opcional):</label>
                <textarea className="textarea" rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} style={INPUT} />
            </div>
            {error && <p className="help is-danger" style={{ fontFamily: 'Poppins', marginTop: '0.75rem' }}>{error}</p>}
        </Modal>
    );
}

interface TermFormModalProps {
    form: TermForm;
    setForm: Dispatch<SetStateAction<TermForm | null>>;
    isEditing: boolean;
    saving: boolean;
    error: string | null;
    onClose: () => void;
    onSave: () => void;
}

export function TermFormModal({ form, setForm, isEditing, saving, error, onClose, onSave }: TermFormModalProps) {
    const update = <K extends keyof TermForm>(field: K, value: TermForm[K]) =>
        setForm((prev) => (prev ? { ...prev, [field]: value } : prev));

    return (
        <Modal
            open
            title={isEditing ? 'Fechas del cuatrimestre' : 'Nuevo cuatrimestre'}
            onClose={onClose}
            footer={(
                <>
                    <ModalCancelButton onClick={onClose} />
                    <ModalSubmitButton onClick={onSave} loading={saving} />
                </>
            )}
        >
            <div style={{ marginBottom: '0.75rem' }}>
                <label style={LABEL}>Nombre:</label>
                <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ej. Sep-Dic 2026" style={INPUT} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                    <label style={LABEL}>Inicio:</label>
                    <input className="input" type="date" value={form.start_date} onChange={(e) => update('start_date', e.target.value)} style={INPUT} />
                </div>
                <div>
                    <label style={LABEL}>Fin:</label>
                    <input className="input" type="date" min={form.start_date} value={form.end_date} onChange={(e) => update('end_date', e.target.value)} style={INPUT} />
                </div>
            </div>
            <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: '#888', marginTop: '0.75rem' }}>
                Este cuatrimestre quedará como el activo y sus fechas se mostrarán a todos en el calendario.
            </p>
            {error && <p className="help is-danger" style={{ fontFamily: 'Poppins', marginTop: '0.5rem' }}>{error}</p>}
        </Modal>
    );
}
