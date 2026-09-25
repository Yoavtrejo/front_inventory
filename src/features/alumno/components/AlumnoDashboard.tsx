'use client';

import Link from 'next/link';
import { useAcademicData, findStudentSubmission, SubmissionStatusBadge, formatDateTime } from '@/features/academic';
import { LoanStatusBadge, formatLoanItems } from '@/features/prestamos';
import { CARD_STYLE, EmptyState } from '@/components/ui/PageHeader';
import { useSessionName } from '@/hooks/useSessionName';
import { useMisPrestamos } from '../hooks/useMisPrestamos';

const CARD_TITLE = { fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#e53e6d', margin: 0 } as const;
const CARD_TEXT = { fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: 0 } as const;

function formatDay(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day} - ${month} - ${year}`;
}

export function AlumnoDashboard() {
    const { userId, activities, submissions, teams, loading, error } = useAcademicData('Alumno');
    const { prestamos, loading: loadingPrestamos } = useMisPrestamos();
    const userName = useSessionName();

    const isLoading = loading || loadingPrestamos;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
            <div>
                <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '2rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                    ¡Bienvenid@ {userName}!
                </h1>
                <p style={{ fontFamily: 'Poppins', color: '#e53e6d', fontWeight: 600, margin: 0 }}>Mantente al día</p>
            </div>

            {error && <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} style={{ height: '130px', borderRadius: '16px', background: 'var(--border)' }} />
                    ))
                    : (
                        <>
                            {activities.map((activity) => {
                                const submission = userId === null ? undefined : findStudentSubmission(submissions, activity, userId, teams);
                                const grade = submission?.status === 'Calificado' && submission.grade !== null ? Number(submission.grade).toFixed(2) : 'Pendiente';
                                return (
                                    <Link key={`activity-${activity.id}`} href="/alumno/actividades" style={{ ...CARD_STYLE, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                            <h3 style={CARD_TITLE}>{activity.title}</h3>
                                            <SubmissionStatusBadge status={submission ? submission.status : 'Asignada'} />
                                        </div>
                                        <p style={CARD_TEXT}>Actividad · Parcial {activity.partial_period}</p>
                                        <p style={CARD_TEXT}><strong>Calificación:</strong> {grade}</p>
                                        {activity.due_date && (
                                            <p style={CARD_TEXT}><strong>Fecha de entrega:</strong> {formatDateTime(activity.due_date)}</p>
                                        )}
                                    </Link>
                                );
                            })}
                            {prestamos.map((loan) => (
                                <Link key={`loan-${loan.id}`} href="/alumno/prestamos" style={{ ...CARD_STYLE, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                                        <h3 style={CARD_TITLE}>Préstamo</h3>
                                        <LoanStatusBadge loan={loan} />
                                    </div>
                                    <p style={CARD_TEXT}>{formatLoanItems(loan)}</p>
                                    <p style={CARD_TEXT}><strong>Fecha de solicitud:</strong> {formatDay(loan.loan_date)}</p>
                                    <p style={CARD_TEXT}><strong>Fecha de entrega:</strong> {formatDay(loan.return_date)}</p>
                                </Link>
                            ))}
                        </>
                    )}
            </div>

            {!isLoading && activities.length === 0 && prestamos.length === 0 && (
                <EmptyState message="No tienes actividades ni préstamos por ahora." />
            )}
        </div>
    );
}
