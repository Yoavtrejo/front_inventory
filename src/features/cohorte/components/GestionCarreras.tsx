'use client';

import { IoAdd, IoPencil, IoTrash } from 'react-icons/io5';
import { PageHeader, PRIMARY_BUTTON_STYLE, CARD_STYLE, EmptyState } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalCancelButton, ModalSubmitButton } from '@/components/ui/Modal/ModalButtons';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import { useCarreras } from '../hooks/useCarreras';
import { useGestionCarreras } from '../hooks/useGestionCarreras';

const CELL = { fontFamily: 'Poppins', fontSize: '0.875rem', color: 'var(--text)', padding: '0.75rem' } as const;
const HEAD = { ...CELL, fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-soft)', textTransform: 'uppercase' as const, textAlign: 'left' as const };
const LABEL = { fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '0.35rem' } as const;

export function GestionCarreras() {
    const { carreras, loading, error, reload } = useCarreras();
    const gestion = useGestionCarreras(reload);

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title="Carreras"
                subtitle="La clave de cada carrera forma el nombre del grupo escolar (ISC + 3° + grupo 4 = ISC34) y se usa para inscribir a los alumnos automáticamente."
                action={(
                    <button onClick={gestion.openCreate} style={{ ...PRIMARY_BUTTON_STYLE, width: '100%', maxWidth: '220px' }}>
                        <IoAdd size={18} /> Agregar carrera
                    </button>
                )}
            />

            {error && <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>}
            {!loading && carreras.some((carrera) => !carrera.clave) && (
                <div className="notification is-warning is-light" style={{ fontFamily: 'Poppins' }}>
                    Hay carreras sin clave. Sus alumnos no podrán inscribirse automáticamente hasta que les agregues una.
                </div>
            )}

            <div style={{ ...CARD_STYLE, padding: '0.5rem', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '480px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={HEAD}>Clave</th>
                            <th style={HEAD}>Nombre</th>
                            <th style={HEAD}>Ejemplo de grupo</th>
                            <th style={HEAD}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carreras.map((carrera) => (
                            <tr key={carrera.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ ...CELL, fontWeight: 700, color: carrera.clave ? '#e53e6d' : '#92400e' }}>{carrera.clave ?? 'Sin clave'}</td>
                                <td style={CELL}>{carrera.nombre}</td>
                                <td style={{ ...CELL, color: 'var(--text-soft)' }}>{carrera.clave ? `${carrera.clave}34` : '—'}</td>
                                <td style={CELL}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => gestion.openEdit(carrera)} title="Editar" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><IoPencil size={16} color="#f97316" /></button>
                                        <button onClick={() => gestion.setToDelete(carrera)} title="Eliminar" style={{ background: 'none', border: 'none', cursor: 'pointer' }}><IoTrash size={16} color="#e53e6d" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && carreras.length === 0 && <EmptyState message="Aún no hay carreras registradas." />}
            </div>

            <Modal
                open={gestion.form !== null}
                title={gestion.isEditing ? 'Editar carrera' : 'Nueva carrera'}
                onClose={gestion.close}
                footer={(
                    <>
                        <ModalCancelButton onClick={gestion.close} />
                        <ModalSubmitButton onClick={gestion.save} loading={gestion.saving} />
                    </>
                )}
            >
                {gestion.form && (
                    <>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <label style={LABEL}>Nombre:</label>
                            <input className="input" value={gestion.form.nombre} onChange={(e) => gestion.setForm((prev) => (prev ? { ...prev, nombre: e.target.value } : prev))} placeholder="Ingeniería en Sistemas Computacionales" style={{ fontFamily: 'Poppins', borderRadius: '8px' }} />
                        </div>
                        <div>
                            <label style={LABEL}>Clave:</label>
                            <input className="input" value={gestion.form.clave} maxLength={10} onChange={(e) => gestion.setForm((prev) => (prev ? { ...prev, clave: e.target.value.toUpperCase() } : prev))} placeholder="ISC" style={{ fontFamily: 'Poppins', borderRadius: '8px', textTransform: 'uppercase' }} />
                            {gestion.form.clave && (
                                <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: '#555', marginTop: '0.35rem' }}>
                                    Ejemplo: 3er cuatrimestre, grupo 4 → <strong style={{ color: '#e53e6d' }}>{gestion.form.clave.trim().replace(/\s+/g, '')}34</strong>
                                </p>
                            )}
                        </div>
                        {gestion.error && <p className="help is-danger" style={{ fontFamily: 'Poppins', marginTop: '0.75rem' }}>{gestion.error}</p>}
                    </>
                )}
            </Modal>

            <ConfirmModal
                open={gestion.toDelete !== null}
                title="Eliminar carrera"
                message={`¿Eliminar "${gestion.toDelete?.nombre ?? ''}"? Solo es posible si no tiene alumnos ni grupos.`}
                onConfirm={gestion.confirmDelete}
                onClose={() => gestion.setToDelete(null)}
                confirmLabel="Eliminar"
                loading={gestion.saving}
            />
        </div>
    );
}
