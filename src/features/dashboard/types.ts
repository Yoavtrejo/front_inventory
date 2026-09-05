export interface UserRef {
    id:         number;
    username:   string;
    email:      string;
    first_name: string;
    last_name:  string;
}

export interface Isla {
    id:                number;
    numero_isla:       number;
    equipos_computo:   number;
    switches:          number;
    routers:           number;
    otros_componentes: string;
    qr_token:          string;
    estado:            'Disponible' | 'Reservada' | 'Ocupada' | 'Mantenimiento';
    created_at:        string;
    updated_at:        string;
}

export interface MaterialLoan {
    id:                   number;
    material:             number;
    quantity:              number;
    loan_period_days:    number;
    loan_date:           string;
    return_date:         string;
    requested_by:        UserRef;
    approved_by:         UserRef | null;
    has_condition_report: boolean;
    created_at:          string;
    updated_at:          string;
}

export interface Reservacion {
    id:                  number;
    isla:                number;
    isla_detalles:       Isla;
    alumno:              UserRef;
    fecha_reserva:       string;
    hora_inicio:         string;
    duracion_horas:      number;
    hora_escaneo_inicio: string | null;
    completada:          boolean;
    cancelada:           boolean;
    created_at:          string;
    updated_at:          string;
}

export interface StatCard {
    label: string;
    value: number;
    icon:  string;
}

export interface DashboardData {
    stats: StatCard[];
}

export interface PaginatedResponse<T> {
    count?:    number;
    next?:     string | null;
    previous?: string | null;
    results?:  T[];
}

export interface ActivityItem {
    id: string;
    usuario: string;
    accion: 'Reserva' | 'Préstamo';
    detalle: string;
    fecha: string;
    estado: 'completado' | 'pendiente' | 'alerta';
}