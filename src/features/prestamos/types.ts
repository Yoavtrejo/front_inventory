export interface UserRef {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    matricula: string | null;
    carrera: string | null;
    grupo_escolar?: string | null;
}

// Un préstamo agrupa varios materiales; estado, fechas y autorización aplican a todo el préstamo
export interface LoanItem {
    id: number;
    material: number;
    material_name: string;
    quantity: number;
}

export interface MaterialLoan{
    id: number;
    items: LoanItem[];
    loan_period_days: number;
    loan_date: string;
    return_date: string;
    requested_by: UserRef;
    approved_by: UserRef | null;
    has_condition_report: boolean;
    status: LoanStatus;
    created_at: string;
    updated_at: string;
}

export type LoanStatus = 'Pendiente' | 'Autorizado' | 'Finalizado' | 'Rechazado' | 'Cancelado';

export interface CreateLoanPayload {
    items:            Array<{ material: number; quantity: number }>;
    loan_period_days: number;
    loan_date:        string;
    return_date:      string;
}

export interface AuthorizeLoanPayload {
    approved_by_user_id: number;
}

export interface LoanFormState {
    material_id: number | null;
    quantity: number;
    loan_period_days: number;
    loan_date: string;
    return_date: string;
}

type LoanFormErrors = Partial<Record<keyof LoanFormState, string>>;

export interface SelectedMaterial {
    material_id: number;
    name: string;
    quantity: number;
    stock: number;
}