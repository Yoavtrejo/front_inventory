export interface LoanHistory {
    id: number;
    original_loand_id: number;
    // Resumen legible: "2 × Cable Ethernet, 1 × Pinzas para ponchar"
    material_name: string;
    quantity: number;
    items: Array<{ material_name: string; quantity: number }>;
    requested_by_username: string;
    approved_by_username: string;
    aproval_date: string;
    loan_date: string;
    return_date: string;
    loan_period_days: number;
}

export interface ConditionReport {
    id: number;
    loan: number;
    user: UserRef;
    description: string;
    photo: string | null;
    created_at: string;
    update_at: string;
}

interface UserRef {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export type { Reservacion } from '@/features/islas/types';
export type PestanaReportes = 'prestamos' | 'condicion' | 'islas';