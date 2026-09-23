'use client';

import { IoCloudUploadOutline, IoDocumentAttachOutline, IoEnterOutline } from 'react-icons/io5';
import { useAcademicData, SubmissionStatusBadge, fileNameFromUrl, formatDateTime, isPastDue } from '@/features/academic';
import { PageHeader, CARD_STYLE, EmptyState } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalCancelButton, ModalSubmitButton } from '@/components/ui/Modal/ModalButtons';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { useEntregas } from '../hooks/useEntregas';
import { useUnirseGrupo } from '../hooks/useUnirseGrupo';

const SECONDARY_BUTTON = { border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' } as const;

export function ActividadesAlumno() {
    const { userId, groups, joinableGroups, activities, submissions, teams, loading, error, reload } = useAcademicData('Alumno');
    const entregas = useEntregas({ userId, submissions, teams, onSubmitted: reload });
    const unirse = useUnirseGrupo(reload);

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title="Actividades"
                subtitle="Visualiza y revisa las actividades asignadas por tu docente."
                action={(
                    <button onClick={unirse.open} style={{ ...SECONDARY_BUTTON, background: '#fce7f3', color: '#9d174d', cursor: 'pointer', padding: '0.6rem 1.1rem' }}>
                        <IoEnterOutline size={16} /> Unirme a un grupo
                    </button>
                )}
            />

            {error && <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} style={{ height: '140px', borderRadius: '16px', background: 'var(--border)' }} />
                    ))
                    : activities.map((activity) => {
                        const submission = entregas.submissionFor(activity);
                        const pendingFile = entregas.pendingFiles[activity.id];
                        const isGraded = submission?.status === 'Calificado';
                        const group = groups.find((candidate) => candidate.id === activity.group);
                        return (
                            <div key={activity.id} style={CARD_STYLE}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                                    <div>
                                        <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.05rem', color: '#e53e6d', margin: 0 }}>{activity.title}</h3>
                                        <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: '#888', margin: 0 }}>
                                            {group ? `${group.subject_name} · Grupo ${group.name}` : ''} · Parcial {activity.partial_period} · {activity.is_team_activity ? 'En equipo' : 'Individual'}
                                        </p>
                                        {activity.due_date && (
                                            <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: isPastDue(activity) && !submission ? '#e53e6d' : 'var(--text-soft)', margin: 0 }}>
                                                <strong>Fecha de entrega:</strong> {formatDateTime(activity.due_date)}
                                                {isPastDue(activity) && !submission && ' · Vencida'}
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                                            <strong>Calificación:</strong> {isGraded && submission.grade !== null ? Number(submission.grade).toFixed(2) : 'Pendiente'}
                                        </span>
                                        <SubmissionStatusBadge status={submission ? submission.status : 'Asignada'} />
                                    </div>
                                </div>

                                <p style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: 'var(--text-soft)', marginBottom: '0.75rem' }}>
                                    <strong>INSTRUCCIONES:</strong> {activity.description || 'Sin instrucciones.'}
                                </p>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontFamily: 'Poppins', fontSize: '0.85rem' }}>
                                        {activity.teacher_file && (
                                            <a href={activity.teacher_file} target="_blank" rel="noopener noreferrer" style={{ color: '#e53e6d', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <IoDocumentAttachOutline /> Material: {fileNameFromUrl(activity.teacher_file)}
                                            </a>
                                        )}
                                        {submission?.student_file && (
                                            <a href={submission.student_file} target="_blank" rel="noopener noreferrer" style={{ color: '#0c5460', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <IoDocumentAttachOutline /> Mi entrega: {fileNameFromUrl(submission.student_file)}
                                            </a>
                                        )}
                                        {submission?.is_late && <span style={{ color: '#e53e6d' }}>Entregada con retraso</span>}
                                        {pendingFile && <span style={{ color: '#92400e' }}>Por entregar: {pendingFile.name}</span>}
                                    </div>

                                    {!isGraded && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => entregas.openUpload(activity)} style={{ ...SECONDARY_BUTTON, background: '#fef3c7', color: '#92400e', cursor: 'pointer' }}>
                                                <IoCloudUploadOutline /> Subir archivo
                                            </button>
                                            <button
                                                onClick={() => entregas.deliver(activity)}
                                                disabled={!pendingFile || entregas.submittingId === activity.id}
                                                style={{ ...SECONDARY_BUTTON, background: pendingFile ? 'linear-gradient(135deg, #f97316, #e53e6d)' : '#f0f0f0', color: pendingFile ? '#fff' : '#aaa', cursor: pendingFile ? 'pointer' : 'not-allowed' }}
                                            >
                                                {entregas.submittingId === activity.id ? 'Entregando...' : submission ? 'Volver a entregar' : 'Entregar'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>

            {!loading && activities.length === 0 && (
                <EmptyState message={groups.length === 0 ? 'Aún no perteneces a ningún grupo. Únete a uno para ver tus actividades.' : 'Tu docente aún no ha asignado actividades.'} />
            )}

            <Modal
                open={entregas.uploadActivity !== null}
                title="Subir Archivo"
                onClose={entregas.closeUpload}
                footer={(
                    <>
                        <ModalCancelButton onClick={entregas.closeUpload} label="Volver" />
                        <ModalSubmitButton onClick={entregas.confirmUpload} disabled={!entregas.draftFile} />
                    </>
                )}
            >
                <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#888', textAlign: 'center', marginBottom: '1rem' }}>
                    {entregas.uploadActivity?.title}
                </p>
                <FileDropzone file={entregas.draftFile} onFileChange={entregas.setDraftFile} />
            </Modal>

            <Modal
                open={unirse.isOpen}
                title="Unirme a un grupo"
                onClose={unirse.close}
                footer={(
                    <>
                        <ModalCancelButton onClick={unirse.close} />
                        <ModalSubmitButton onClick={unirse.join} loading={unirse.joining} disabled={unirse.selectedGroupId === null} label="Unirme" loadingLabel="Uniendo..." />
                    </>
                )}
            >
                {joinableGroups.length === 0 ? (
                    <p style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: '#888', textAlign: 'center' }}>No hay grupos disponibles.</p>
                ) : (
                    <div className="select is-fullwidth">
                        <select
                            value={unirse.selectedGroupId ?? ''}
                            onChange={(event) => unirse.setSelectedGroupId(event.target.value ? Number(event.target.value) : null)}
                            style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' }}
                        >
                            <option value="">Selecciona una opción</option>
                            {joinableGroups.map((group) => (
                                <option key={group.id} value={group.id}>{group.name} · {group.subject_name} · {group.term_name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </Modal>
        </div>
    );
}
