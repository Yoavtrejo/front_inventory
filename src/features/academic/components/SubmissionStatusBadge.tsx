import type { SubmissionStatus } from '../types';

export type ActivityProgress = SubmissionStatus | 'Asignada';

const STATUS_STYLES: Record<ActivityProgress, { background: string; color: string }> = {
    'Asignada':    { background: '#E2E3E5', color: '#383D41' },
    'Entregado':   { background: '#D1ECF1', color: '#0C5460' },
    'En revisión': { background: '#FFF3CD', color: '#856404' },
    'Calificado':  { background: '#D4EDDA', color: '#155724' },
};

export function SubmissionStatusBadge({ status }: { status: ActivityProgress }) {
    return (
        <span style={{ ...STATUS_STYLES[status], fontFamily: 'Poppins', padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {status}
        </span>
    );
}
