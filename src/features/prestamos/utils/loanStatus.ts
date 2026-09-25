import type { MaterialLoan, LoanStatus } from '@/features/prestamos/types';

export function getLoanStatus(loan:MaterialLoan): LoanStatus {
    return loan.status;
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

// "2 × Cable Ethernet, 1 × Pinzas para ponchar"
export function formatLoanItems(loan: MaterialLoan): string {
    return loan.items.map((item) => `${item.quantity} × ${item.material_name}`).join(', ');
}
