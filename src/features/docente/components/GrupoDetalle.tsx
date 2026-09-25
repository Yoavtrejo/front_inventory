'use client';

import Link from 'next/link';
import { useState } from 'react';
import { IoArrowBack, IoPeopleOutline } from 'react-icons/io5';
import { useAcademicData } from '@/features/academic';
import { PageHeader, PRIMARY_BUTTON_STYLE, CARD_STYLE, EmptyState } from '@/components/ui/PageHeader';
import { EntregasTable } from './EntregasTable';

export function GrupoDetalle({ groupId }: { groupId: number }) {
    const { groups, activities, submissions, teams, students, loading, error, reload } = useAcademicData('Docente');
    const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

    const group = groups.find((candidate) => candidate.id === groupId);
    const groupActivities = activities.filter((activity) => activity.group === groupId);
    const selectedActivity = groupActivities.find((activity) => activity.id === selectedActivityId) ?? groupActivities[0];

    const backLink = (
        <Link href="/docente/grupos" style={{ fontFamily: 'Poppins', color: '#e53e6d', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
            <IoArrowBack /> Volver a grupos
        </Link>
    );

    if (loading) return <p style={{ fontFamily: 'Poppins', color: '#888', padding: '2rem' }}>Cargando grupo...</p>;
    if (error) return <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>;
    if (!group) return <>{backLink}<EmptyState message="El grupo no existe o no está asignado a ti." /></>;

    return (
        <div style={{ width: '100%' }}>
            {backLink}
            <div style={{ marginTop: '1rem' }}>
                <PageHeader
                    title={`Grupo ${group.name}`}
                    subtitle={`${group.subject_name.toUpperCase()} · ${group.term_name} · ${group.students.length} alumnos`}
                    action={(
                        <Link href={`/docente/grupos/equipos?grupo=${group.id}`} style={{ ...PRIMARY_BUTTON_STYLE, textDecoration: 'none', width: '100%', maxWidth: '220px' }}>
                            <IoPeopleOutline size={18} /> Equipos
                        </Link>
                    )}
                />
            </div>

            {groupActivities.length === 0 ? (
                <EmptyState message="Este grupo aún no tiene actividades." />
            ) : (
                <div style={{ ...CARD_STYLE, padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                        <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>Actividad:</label>
                        <div className="select">
                            <select
                                value={selectedActivity?.id ?? ''}
                                onChange={(event) => setSelectedActivityId(Number(event.target.value))}
                                style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' }}
                            >
                                {groupActivities.map((activity) => (
                                    <option key={activity.id} value={activity.id}>
                                        {activity.title} (Parcial {activity.partial_period})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {selectedActivity && (
                        <EntregasTable activity={selectedActivity} group={group} students={students} teams={teams} submissions={submissions} onGraded={reload} />
                    )}
                </div>
            )}
        </div>
    );
}
