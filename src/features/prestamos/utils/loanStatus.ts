import type { MaterialLoan, LoanStatus } from '@/features/prestamos/types';

export function getLoanStatus(loan:MaterialLoan): LoanStatus {
    if (loan.has_condition_report) return 'Finalizado';
    if (loan.approved_by !== null) return 'Autorizado';
    return 'Pendiente';
}

export function getLoanStatusStyle(status: LoanStatus):{ background: string, color: string} {
    const styles : Record<LoanStatus, { background: string, color: string}> = {
        'Pendiente': { background: '#FFF3CD', color: '#856404' },
        'Autorizado': { background: '#D1ECF1', color: '#0C5460' },
        'Finalizado': { background: '#D4EDDA', color: '#155724' },
        'Rechazado': { background: '#F8D7DA', color: '#721C24' },
        'Cancelado': { background: '#E2E3E5', color: '#383D41' },
    };
    return styles[status];
}