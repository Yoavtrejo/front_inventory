'use client';

import Link from 'next/link';
import { IoPeople } from 'react-icons/io5';
import { StatCard } from '@/features/dashboard';
import { useAcademicData } from '@/features/academic';
import { CARD_STYLE, EmptyState } from '@/components/ui/PageHeader';
import { useSessionName } from '@/hooks/useSessionName';

export function DocenteDashboard() {
  const { groups, submissions, loading, error } = useAcademicData('Docente');
  const userName = useSessionName();

  const pendingCount = submissions.filter((submission) => submission.status !== 'Calificado').length;
  const gradedCount = submissions.length - pendingCount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div>
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
          ¡Bienvenid@ {userName}!
        </h1>
        <p style={{ fontFamily: 'Poppins', color: '#e53e6d', fontWeight: 600, margin: 0 }}>
          Mantente al día
        </p>
      </div>

      {error && (
        <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
            <div key={index} style={{ height: '110px', borderRadius: '16px', background: 'var(--border)' }} />
          ))
          : (
            <>
              <StatCard label="Grupos asignados" value={groups.length} icon="people" />
              <StatCard label="Entregas por atender" value={pendingCount} icon="pending" />
              <StatCard label="Entregas atendidas" value={gradedCount} icon="done" />
            </>
          )}
      </div>

      <div>
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', marginBottom: '1rem' }}>
          Mis grupos
        </h2>
        {!loading && groups.length === 0 && <EmptyState message="Aún no tienes grupos asignados." />}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {groups.map((group) => (
            <Link key={group.id} href={`/docente/grupos/${group.id}`} style={{ ...CARD_STYLE, textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#e53e6d' }}>
                  Grupo {group.name}
                </span>
                <IoPeople size={20} color="#f97316" />
              </div>
              <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: '0 0 0.25rem' }}>
                <strong>Materia:</strong> {group.subject_name}
              </p>
              <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0 }}>
                <strong>Alumnos:</strong> {group.students.length}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
