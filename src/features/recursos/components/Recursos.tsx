'use client';

import { IoAdd, IoBulbOutline, IoDocumentAttachOutline, IoTrash } from 'react-icons/io5';
import { PageHeader, PRIMARY_BUTTON_STYLE, CARD_STYLE, EmptyState } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalCancelButton, ModalSubmitButton } from '@/components/ui/Modal/ModalButtons';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { useRecursos } from '../hooks/useRecursos';

interface RecursosProps {
    // El docente puede registrar recursos; el alumno solo los consulta
    canManage: boolean;
}

const LABEL_STYLE = { fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '0.35rem' } as const;

export function Recursos({ canManage }: RecursosProps) {
    const {
        recursos, loading, error, isBackendAvailable,
        isModalOpen, openModal, closeModal, form, updateField, formErrors, saving, handleSubmit, handleDelete,
    } = useRecursos();

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title="Recursos"
                subtitle={canManage ? 'Sube contenido informativo que permita al usuario entender los temas.' : 'Consulta la información de cada recurso.'}
                action={canManage ? (
                    <button onClick={openModal} disabled={!isBackendAvailable} style={{ ...PRIMARY_BUTTON_STYLE, width: '100%', maxWidth: '220px', opacity: isBackendAvailable ? 1 : 0.6, cursor: isBackendAvailable ? 'pointer' : 'not-allowed' }}>
                        <IoAdd size={18} /> Agregar
                    </button>
                ) : undefined}
            />

            {!isBackendAvailable && (
                <div className="notification is-warning is-light" style={{ fontFamily: 'Poppins' }}>
                    El módulo de recursos todavía no está disponible en el servidor. Pronto podrás consultar y registrar recursos aquí.
                </div>
            )}
            {error && <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} style={{ height: '160px', borderRadius: '16px', background: 'var(--border)' }} />
                    ))
                    : recursos.map((recurso) => (
                        <div key={recurso.id} style={{ ...CARD_STYLE, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#fef3c7', color: '#92400e', borderRadius: '20px', padding: '0.2rem 0.75rem', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.75rem' }}>
                                    <IoBulbOutline /> Tip
                                </span>
                                {canManage && (
                                    <button onClick={() => handleDelete(recurso.id)} title="Eliminar" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                        <IoTrash size={16} color="#e53e6d" />
                                    </button>
                                )}
                            </div>
                            <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>{recurso.title}</h3>
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0 }}>{recurso.description}</p>
                            {recurso.file && (
                                <a href={recurso.file} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#e53e6d', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: 'auto' }}>
                                    <IoDocumentAttachOutline /> Ver archivo
                                </a>
                            )}
                        </div>
                    ))}
            </div>

            {!loading && isBackendAvailable && recursos.length === 0 && <EmptyState message="Aún no hay recursos registrados." />}

            <Modal
                open={isModalOpen}
                title="Registro de recursos"
                onClose={closeModal}
                footer={(
                    <>
                        <ModalCancelButton onClick={closeModal} />
                        <ModalSubmitButton onClick={handleSubmit} loading={saving} />
                    </>
                )}
            >
                <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#888', textAlign: 'center', marginBottom: '1rem' }}>Completa lo siguiente</p>
                <div style={{ marginBottom: '0.75rem' }}>
                    <label style={LABEL_STYLE}>Título:</label>
                    <input className={`input ${formErrors.title ? 'is-danger' : ''}`} value={form.title} onChange={(event) => updateField('title', event.target.value)} style={{ fontFamily: 'Poppins', borderRadius: '8px' }} />
                    {formErrors.title && <p style={{ color: '#e53e6d', fontSize: '0.78rem', fontFamily: 'Poppins' }}>{formErrors.title}</p>}
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                    <label style={LABEL_STYLE}>Descripción:</label>
                    <textarea className={`textarea ${formErrors.description ? 'is-danger' : ''}`} rows={3} value={form.description} onChange={(event) => updateField('description', event.target.value)} style={{ fontFamily: 'Poppins', borderRadius: '8px' }} />
                    {formErrors.description && <p style={{ color: '#e53e6d', fontSize: '0.78rem', fontFamily: 'Poppins' }}>{formErrors.description}</p>}
                </div>
                <label style={LABEL_STYLE}>Subir un archivo (Opcional):</label>
                <FileDropzone file={form.file} onFileChange={(file) => updateField('file', file)} />
            </Modal>
        </div>
    );
}
