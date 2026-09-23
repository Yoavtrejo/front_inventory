'use client';

import { IoDocumentAttachOutline } from 'react-icons/io5';
import { SubmissionStatusBadge, studentFullName, fileNameFromUrl } from '@/features/academic';
import type { Activity, ClassGroup, Submission, StudentSummary, WorkTeam } from '@/features/academic';
import { useCalificarEntrega } from '../hooks/useCalificarEntrega';

interface EntregasTableProps {
    activity: Activity;
    group: ClassGroup;
    students: StudentSummary[];
    teams: WorkTeam[];
    submissions: Submission[];
    onGraded: () => void;
}

interface EntregaRow {
    key: string;
    identifier: string;
    name: string;
    submission: Submission | undefined;
}

const HEADER_CELL = { fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-soft)', textTransform: 'uppercase' as const, padding: '0.75rem', textAlign: 'left' as const };
const BODY_CELL = { fontFamily: 'Poppins', fontSize: '0.875rem', color: 'var(--text)', padding: '0.75rem', verticalAlign: 'middle' as const };

function buildRows({ activity, group, students, teams, submissions }: Omit<EntregasTableProps, 'onGraded'>): EntregaRow[] {
    const activitySubmissions = submissions.filter((submission) => submission.activity === activity.id);

    if (activity.is_team_activity) {
        return teams.filter((team) => team.group === group.id).map((team) => ({
            key: `team-${team.id}`,
            identifier: team.name,
            name: team.members.map((memberId) => studentFullName(students.find((student) => student.id === memberId))).join(', '),
            submission: activitySubmissions.find((submission) => submission.work_team === team.id),
        }));
    }

    return group.students.map((studentId) => {
        const student = students.find((candidate) => candidate.id === studentId);
        return {
            key: `student-${studentId}`,
            identifier: student?.username ?? String(studentId),
            name: studentFullName(student),
            submission: activitySubmissions.find((submission) => submission.student === studentId),
        };
    });
}

export function EntregasTable(props: EntregasTableProps) {
    const { gradeValue, setGradeDraft, saveGrade, markInReview, savingId } = useCalificarEntrega(props.onGraded);
    const rows = buildRows(props);

    if (rows.length === 0) {
        return (
            <p style={{ fontFamily: 'Poppins', color: '#aaa', padding: '1.5rem', textAlign: 'center' }}>
                {props.activity.is_team_activity ? 'Este grupo aún no tiene equipos.' : 'Este grupo aún no tiene alumnos.'}
            </p>
        );
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <th style={HEADER_CELL}>{props.activity.is_team_activity ? 'Equipo' : 'Matrícula'}</th>
                        <th style={HEADER_CELL}>{props.activity.is_team_activity ? 'Integrantes' : 'Nombre completo'}</th>
                        <th style={HEADER_CELL}>Archivo</th>
                        <th style={HEADER_CELL}>Estatus</th>
                        <th style={HEADER_CELL}>Calificación</th>
                        <th style={HEADER_CELL}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ key, identifier, name, submission }) => (
                        <tr key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={BODY_CELL}>{identifier}</td>
                            <td style={BODY_CELL}>{name}</td>
                            <td style={BODY_CELL}>
                                {submission?.student_file ? (
                                    <a href={submission.student_file} target="_blank" rel="noopener noreferrer" style={{ color: '#e53e6d', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <IoDocumentAttachOutline /> {fileNameFromUrl(submission.student_file)}
                                    </a>
                                ) : <span style={{ color: '#aaa' }}>—</span>}
                            </td>
                            <td style={BODY_CELL}>
                                <SubmissionStatusBadge status={submission ? submission.status : 'Asignada'} />
                            </td>
                            <td style={BODY_CELL}>
                                {submission ? (
                                    <input
                                        className="input"
                                        type="number"
                                        min={0}
                                        max={10}
                                        step={0.1}
                                        value={gradeValue(submission)}
                                        onChange={(event) => setGradeDraft(submission.id, event.target.value)}
                                        style={{ fontFamily: 'Poppins', borderRadius: '8px', width: '90px' }}
                                    />
                                ) : <span style={{ color: '#aaa' }}>Sin entrega</span>}
                            </td>
                            <td style={BODY_CELL}>
                                {submission && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {submission.status === 'Entregado' && (
                                            <button
                                                onClick={() => markInReview(submission)}
                                                disabled={savingId === submission.id}
                                                style={{ background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                                            >
                                                En revisión
                                            </button>
                                        )}
                                        <button
                                            onClick={() => saveGrade(submission)}
                                            disabled={savingId === submission.id}
                                            style={{ background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.8rem', cursor: savingId === submission.id ? 'not-allowed' : 'pointer' }}
                                        >
                                            {savingId === submission.id ? 'Guardando...' : 'Calificar'}
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
