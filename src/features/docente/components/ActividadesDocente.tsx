'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IoAdd, IoDocumentAttachOutline, IoTrash } from 'react-icons/io5';
import { academicService, useAcademicData, expectedSubmissions, formatDateTime, fileNameFromUrl } from '@/features/academic';
import { PageHeader, PRIMARY_BUTTON_STYLE, CARD_STYLE, EmptyState } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/Modal/ConfirmModal';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { getApiErrorMessage } from '@/utils/apiResponse';
import type { Activity } from '@/features/academic';

export function ActividadesDocente() {
    const { groups, activities, submissions, teams, loading, error, reload } = useAcademicData('Docente');
    const { showToast } = useToast();
    const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!activityToDelete) return;
        setIsDeleting(true);
        try {
            await academicService.deleteActivity(activityToDelete.id);
            showToast('Actividad eliminada.', 'success');
            setActivityToDelete(null);
            reload();
        } catch (err) {
            showToast(getApiErrorMessage(err, 'No se pudo eliminar la actividad.'), 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title="Gestión de Actividades"
                subtitle="Administra todas las actividades asignadas a los grupos."
                action={(
                    <Link href="/docente/actividades/crear" style={{ ...PRIMARY_BUTTON_STYLE, textDecoration: 'none', width: '100%', maxWidth: '220px' }}>
                        <IoAdd size={18} /> Nueva Actividad
                    </Link>
                )}
            />

            {error && <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {loading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} style={{ height: '200px', borderRadius: '16px', background: 'var(--border)' }} />
                    ))
                    : activities.map((activity, index) => {
                        const group = groups.find((candidate) => candidate.id === activity.group);
                        const deliveredCount = submissions.filter((submission) => submission.activity === activity.id).length;
                        return (
                            <div key={activity.id} style={{ ...CARD_STYLE, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', color: '#e53e6d', borderBottom: '2px solid #f97316', paddingBottom: '2px' }}>
                                        Actividad #{index + 1}{activity.is_team_activity ? ' · Equipo' : ''}
                                    </span>
                                    <button onClick={() => setActivityToDelete(activity)} title="Eliminar" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                        <IoTrash size={18} color="#e53e6d" />
                                    </button>
                                </div>
                                <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', margin: 0 }}>
                                    {activity.title}
                                </h3>
                                <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0 }}>
                                    <strong>INSTRUCCIÓN:</strong> {activity.description || 'Sin instrucciones.'}
                                </p>
                                {activity.teacher_file && (
                                    <a href={activity.teacher_file} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#e53e6d', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <IoDocumentAttachOutline /> {fileNameFromUrl(activity.teacher_file)}
                                    </a>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                                    <span><strong>Parcial:</strong> {activity.partial_period}</span>
                                    <span><strong>Grupo:</strong> {group?.name ?? activity.group}</span>
                                </div>
                                <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0 }}>
                                    <strong>Fecha de entrega:</strong> {activity.due_date ? formatDateTime(activity.due_date) : 'Sin fecha'}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                    <span style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                                        <strong>Total de entregas:</strong> {deliveredCount}/{expectedSubmissions(activity, group, teams)}
                                    </span>
                                    <Link href={`/docente/actividades/${activity.id}`} style={{ background: '#fce7f3', color: '#9d174d', borderRadius: '8px', padding: '0.4rem 1rem', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}>
                                        Revisar
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {!loading && activities.length === 0 && <EmptyState message="Aún no has creado actividades." />}

            <ConfirmModal
                open={activityToDelete !== null}
                title="Eliminar actividad"
                message={`¿Seguro que deseas eliminar "${activityToDelete?.title ?? ''}"? También se eliminarán sus entregas.`}
                onConfirm={handleDelete}
                onClose={() => setActivityToDelete(null)}
                confirmLabel="Eliminar"
                loading={isDeleting}
            />
        </div>
    );
}
