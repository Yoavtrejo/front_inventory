'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { IoArrowBack, IoTrash } from 'react-icons/io5';
import { useAcademicData, studentFullName } from '@/features/academic';
import { PageHeader, CARD_STYLE } from '@/components/ui/PageHeader';
import { ModalSubmitButton } from '@/components/ui/Modal/ModalButtons';
import { useCrearEquipos } from '../hooks/useCrearEquipos';
import type { ClassGroup, StudentSummary, WorkTeam } from '@/features/academic';

const SECTION_TITLE = { fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: '0.75rem' } as const;

export function CrearEquipos() {
    const searchParams = useSearchParams();
    const initialGroupId = searchParams.get('grupo') ? Number(searchParams.get('grupo')) : null;
    const { groups, teams, students, loading, error, reload } = useAcademicData('Docente');

    if (loading) return <p style={{ fontFamily: 'Poppins', color: '#888', padding: '2rem' }}>Cargando grupos...</p>;
    if (error) return <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>;

    return <CrearEquiposForm groups={groups} teams={teams} students={students} initialGroupId={initialGroupId} onSaved={reload} />;
}

interface CrearEquiposFormProps {
    groups: ClassGroup[];
    teams: WorkTeam[];
    students: StudentSummary[];
    initialGroupId: number | null;
    onSaved: () => void;
}

function CrearEquiposForm({ groups, teams, students, initialGroupId, onSaved }: CrearEquiposFormProps) {
    const {
        selectedGroupId, selectGroup, group, groupTeams, availableStudentIds,
        selectedMembers, toggleMember, teamName, setTeamName, saving, saveTeam, deleteTeam, nextTeamName,
    } = useCrearEquipos(groups, teams, initialGroupId, onSaved);

    const nameOf = (studentId: number) => studentFullName(students.find((student) => student.id === studentId));

    return (
        <div style={{ width: '100%' }}>
            <Link href="/docente/grupos" style={{ fontFamily: 'Poppins', color: '#e53e6d', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
                <IoArrowBack /> Volver a grupos
            </Link>
            <div style={{ marginTop: '1rem' }}>
                <PageHeader title="Crear Equipos" subtitle="Completa el siguiente formulario." />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>Selecciona un grupo:</label>
                <div className="select">
                    <select
                        value={selectedGroupId ?? ''}
                        onChange={(event) => selectGroup(event.target.value ? Number(event.target.value) : null)}
                        style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' }}
                    >
                        <option value="">Selecciona una opción</option>
                        {groups.map((candidate) => (
                            <option key={candidate.id} value={candidate.id}>{candidate.name} · {candidate.subject_name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {group && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                    <div style={CARD_STYLE}>
                        <h3 style={SECTION_TITLE}>Alumnos disponibles ({availableStudentIds.length})</h3>
                        {availableStudentIds.length === 0 && (
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#aaa' }}>Todos los alumnos ya tienen equipo.</p>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
                            {availableStudentIds.map((studentId) => {
                                const isSelected = selectedMembers.includes(studentId);
                                return (
                                    <label key={studentId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '10px', cursor: 'pointer', fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text)', background: isSelected ? '#fff7ed' : 'var(--surface-soft)', border: isSelected ? '1px solid #f97316' : '1px solid transparent' }}>
                                        <input type="checkbox" checked={isSelected} onChange={() => toggleMember(studentId)} style={{ accentColor: '#e53e6d' }} />
                                        {nameOf(studentId)}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div style={CARD_STYLE}>
                        <h3 style={SECTION_TITLE}>Equipos</h3>

                        <div style={{ border: '1px dashed #f97316', borderRadius: '12px', padding: '0.75rem', marginBottom: '1rem' }}>
                            <input
                                className="input"
                                value={teamName}
                                onChange={(event) => setTeamName(event.target.value)}
                                placeholder={nextTeamName}
                                style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px', marginBottom: '0.5rem' }}
                            />
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '0.75rem' }}>
                                {selectedMembers.length === 0 ? 'Selecciona alumnos de la lista (máx. 7).' : selectedMembers.map(nameOf).join(', ')}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <ModalSubmitButton onClick={saveTeam} loading={saving} disabled={selectedMembers.length === 0} label="Guardar equipo" />
                            </div>
                        </div>

                        {groupTeams.length === 0 && (
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#aaa' }}>Este grupo aún no tiene equipos.</p>
                        )}
                        {groupTeams.map((team) => (
                            <div key={team.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', padding: '0.75rem 0', borderTop: '1px solid var(--border)' }}>
                                <div>
                                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', color: '#e53e6d', margin: 0 }}>{team.name}</p>
                                    <p style={{ fontFamily: 'Poppins', fontSize: '0.8rem', color: 'var(--text-soft)', margin: 0 }}>
                                        {team.members.map(nameOf).join(', ')}
                                    </p>
                                </div>
                                <button onClick={() => deleteTeam(team.id)} title="Eliminar equipo" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                    <IoTrash size={16} color="#e53e6d" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
