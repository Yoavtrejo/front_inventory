'use client';

import Link from 'next/link';
import { IoArrowBack, IoDocumentAttachOutline } from 'react-icons/io5';
import { useAcademicData, fileNameFromUrl, formatDate } from '@/features/academic';
import { PageHeader, CARD_STYLE, EmptyState } from '@/components/ui/PageHeader';
import { EntregasTable } from './EntregasTable';

export function RevisarActividad({ activityId }: { activityId: number }) {
    const { groups, activities, submissions, teams, students, loading, error, reload } = useAcademicData('Docente');
    const activity = activities.find((candidate) => candidate.id === activityId);
    const group = groups.find((candidate) => candidate.id === activity?.group);

    const backLink = (
        <Link href="/docente/actividades" style={{ fontFamily: 'Poppins', color: '#e53e6d', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
            <IoArrowBack /> Volver a actividades
        </Link>
    );

    if (loading) return <p style={{ fontFamily: 'Poppins', color: '#888', padding: '2rem' }}>Cargando actividad...</p>;
    if (error) return <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>;
    if (!activity || !group) return <>{backLink}<EmptyState message="La actividad no existe o no pertenece a tus grupos." /></>;

    return (
        <div style={{ width: '100%' }}>
            {backLink}
            <div style={{ marginTop: '1rem' }}>
                <PageHeader title={activity.title} subtitle={`Grupo ${group.name} · ${group.subject_name} · Parcial ${activity.partial_period}`} />
            </div>

            <div style={{ ...CARD_STYLE, marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'Poppins', fontSize: '0.9rem', color: 'var(--text-soft)', margin: 0 }}>
                    <strong>INSTRUCCIÓN:</strong> {activity.description || 'Sin instrucciones.'}
                </p>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '0.75rem', fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                    <span><strong>Tipo:</strong> {activity.is_team_activity ? 'En equipo' : 'Individual'}</span>
                    <span><strong>Creada:</strong> {formatDate(activity.created_at)}</span>
                    {activity.teacher_file && (
                        <a href={activity.teacher_file} target="_blank" rel="noopener noreferrer" style={{ color: '#e53e6d', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            <IoDocumentAttachOutline /> {fileNameFromUrl(activity.teacher_file)}
                        </a>
                    )}
                </div>
            </div>

            <div style={{ ...CARD_STYLE, padding: '0.5rem' }}>
                <EntregasTable activity={activity} group={group} students={students} teams={teams} submissions={submissions} onGraded={reload} />
            </div>
        </div>
    );
}
