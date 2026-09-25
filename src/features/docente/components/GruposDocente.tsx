'use client';

import Link from 'next/link';
import { IoPeople, IoPeopleOutline } from 'react-icons/io5';
import { useAcademicData } from '@/features/academic';
import { PageHeader, PRIMARY_BUTTON_STYLE, CARD_STYLE, EmptyState } from '@/components/ui/PageHeader';

export function GruposDocente() {
    const { groups, activities, loading, error } = useAcademicData('Docente');

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title="Gestión de Grupos"
                subtitle="Administra los grupos asignados."
                action={(
                    <Link href="/docente/grupos/equipos" style={{ ...PRIMARY_BUTTON_STYLE, textDecoration: 'none', width: '100%', maxWidth: '220px' }}>
                        <IoPeopleOutline size={18} /> Crear Equipos
                    </Link>
                )}
            />

            {error && <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} style={{ height: '140px', borderRadius: '16px', background: 'var(--border)' }} />
                    ))
                    : groups.map((group) => (
                        <Link key={group.id} href={`/docente/grupos/${group.id}`} style={{ ...CARD_STYLE, textDecoration: 'none', display: 'block' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: '#e53e6d' }}>{group.name}</span>
                                <IoPeople size={20} color="#f97316" />
                            </div>
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: '0 0 0.25rem' }}>
                                <strong>Materia:</strong> {group.subject_name}
                            </p>
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: '0 0 0.25rem' }}>
                                <strong>Periodo:</strong> {group.term_name}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                                <span><strong>Alumnos:</strong> {group.students.length}</span>
                                <span><strong>Actividades:</strong> {activities.filter((activity) => activity.group === group.id).length}</span>
                            </div>
                        </Link>
                    ))}
            </div>

            {!loading && groups.length === 0 && <EmptyState message="Aún no tienes grupos asignados. Pide al administrador que te asigne uno." />}
        </div>
    );
}
