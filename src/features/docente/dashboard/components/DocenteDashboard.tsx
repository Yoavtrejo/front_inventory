'use client';

import { useRouter } from 'next/navigation';
import { IoPeople, IoClipboard } from 'react-icons/io5';
import { useDocenteDashboard } from '../hooks/useDocenteDashboard';

export function DocenteDashboard() {
  const { grupos, loading, first_name } = useDocenteDashboard();
  const router = useRouter();

  return (
    <div>
      <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>
        ¡Bienvenida {first_name}!
      </h1>
      <p style={{ fontFamily: 'Poppins', color: '#e53e6d', fontWeight: 600, marginBottom: '1.75rem' }}>
        Mantente al día
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#555', fontWeight: 500 }}>
              Grupos asignados
            </span>
            <IoPeople size={18} color="#f97316" />
          </div>
          <span style={{ fontFamily: 'Poppins', fontSize: '2rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1 }}>
            {String(grupos.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ height: '120px', borderRadius: '16px', background: '#f0f0f0' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {grupos.map((grupo) => (
            <div
              key={grupo.id}
              onClick={() => router.push(`/docente/grupos/${grupo.id}`)}
              style={{
                background:'#fff',
                borderRadius:'16px',
                padding:'1.25rem 1.5rem',
                boxShadow:'0 2px 8px rgba(0,0,0,0.06)',
                cursor:'pointer',
                border:'1px solid transparent',
                transition:'border 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.border = '1px solid #f97316';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.border = '1px solid transparent';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#e53e6d' }}>
                  {grupo.name}
                </span>
                <IoPeople size={20} color="#f97316" />
              </div>
              <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#555', margin: '0 0 0.25rem' }}>
                <strong>Materia:</strong> {grupo.subject.name}
              </p>
              <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#555', margin: 0 }}>
                <strong>Alumnos:</strong> {grupo.students.length}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}