'use client';

import Link from 'next/link';
import { IoPeopleOutline } from 'react-icons/io5';
import { useAcademicData } from '@/features/academic';
import { PageHeader, CARD_STYLE } from '@/components/ui/PageHeader';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { ModalCancelButton, ModalSubmitButton } from '@/components/ui/Modal/ModalButtons';
import { useCrearActividad } from '../hooks/useCrearActividad';

const LABEL_STYLE = { fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: '0.35rem' } as const;
const INPUT_STYLE = { fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' } as const;

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p style={{ color: '#e53e6d', fontSize: '0.78rem', fontFamily: 'Poppins', marginTop: '0.25rem' }}>{message}</p>;
}

export function CrearActividad() {
    const { groups, loading } = useAcademicData('Docente');
    const { form, updateField, formErrors, saving, error, handleSubmit, handleCancel } = useCrearActividad();

    return (
        <div style={{ width: '100%' }}>
            <PageHeader title="Crear Actividad" subtitle="Completa el siguiente formulario." />

            <div style={{ ...CARD_STYLE, padding: '1.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={LABEL_STYLE}>Tipo:</label>
                            <div className="select is-fullwidth">
                                <select
                                    value={form.is_team_activity ? 'equipo' : 'individual'}
                                    onChange={(event) => updateField('is_team_activity', event.target.value === 'equipo')}
                                    style={INPUT_STYLE}
                                >
                                    <option value="individual">Individual</option>
                                    <option value="equipo">En equipo</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={LABEL_STYLE}>Nombre de la actividad:</label>
                            <input
                                className={`input ${formErrors.title ? 'is-danger' : ''}`}
                                value={form.title}
                                onChange={(event) => updateField('title', event.target.value)}
                                placeholder="Ej. Configuración de NAT"
                                style={INPUT_STYLE}
                            />
                            <FieldError message={formErrors.title} />
                        </div>

                        <div>
                            <label style={LABEL_STYLE}>Instrucciones:</label>
                            <textarea
                                className={`textarea ${formErrors.description ? 'is-danger' : ''}`}
                                value={form.description}
                                onChange={(event) => updateField('description', event.target.value)}
                                rows={4}
                                style={INPUT_STYLE}
                            />
                            <FieldError message={formErrors.description} />
                        </div>

                        <div>
                            <label style={LABEL_STYLE}>Parcial:</label>
                            <div className="select is-fullwidth">
                                <select
                                    value={form.partial_period}
                                    onChange={(event) => updateField('partial_period', Number(event.target.value))}
                                    style={INPUT_STYLE}
                                >
                                    <option value={1}>Parcial 1</option>
                                    <option value={2}>Parcial 2</option>
                                    <option value={3}>Parcial 3</option>
                                </select>
                            </div>
                            <FieldError message={formErrors.partial_period} />
                        </div>

                        <div>
                            <label style={LABEL_STYLE}>Fecha de entrega:</label>
                            <input
                                className={`input ${formErrors.due_date ? 'is-danger' : ''}`}
                                type="datetime-local"
                                value={form.due_date}
                                onChange={(event) => updateField('due_date', event.target.value)}
                                style={INPUT_STYLE}
                            />
                            <FieldError message={formErrors.due_date} />
                        </div>

                        <div>
                            <label style={LABEL_STYLE}>Asignar a un grupo:</label>
                            <div className={`select is-fullwidth ${formErrors.group ? 'is-danger' : ''}`}>
                                <select
                                    value={form.group ?? ''}
                                    onChange={(event) => updateField('group', event.target.value ? Number(event.target.value) : null)}
                                    disabled={loading}
                                    style={INPUT_STYLE}
                                >
                                    <option value="">{loading ? 'Cargando grupos...' : 'Selecciona una opción'}</option>
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>{group.name} · {group.subject_name}</option>
                                    ))}
                                </select>
                            </div>
                            <FieldError message={formErrors.group} />
                            {!loading && groups.length === 0 && (
                                <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
                                    No tienes grupos asignados.
                                </p>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={LABEL_STYLE}>Archivo de la actividad (opcional):</label>
                            <FileDropzone file={form.teacher_file} onFileChange={(file) => updateField('teacher_file', file)} />
                        </div>

                        {form.is_team_activity && (
                            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                                <p style={{ ...LABEL_STYLE, marginBottom: '0.5rem' }}>Asignar a un equipo</p>
                                <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem' }}>
                                    Las entregas se harán por equipo. Asegúrate de que el grupo tenga equipos creados.
                                </p>
                                <Link
                                    href={form.group ? `/docente/grupos/equipos?grupo=${form.group}` : '/docente/grupos/equipos'}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fce7f3', color: '#9d174d', borderRadius: '8px', padding: '0.4rem 1rem', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}
                                >
                                    <IoPeopleOutline /> Crear Equipos
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {error && <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins', marginTop: '1rem' }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                    <ModalCancelButton onClick={handleCancel} />
                    <ModalSubmitButton onClick={handleSubmit} loading={saving} />
                </div>
            </div>
        </div>
    );
}
