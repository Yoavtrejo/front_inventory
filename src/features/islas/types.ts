export type IslaEstado = 'Disponible' | 'Reservada';

export type ReservacionEstado = 'Activa' | 'Completada' | 'Cancelada' | 'Expirada';


export interface Isla {
    id: number;
    numero_isla: number;
    equipos_computo: number;
    switches: number;
    routers: number;
    otros_componentes: Record<string, string> | string;
    qr_token: string;
    estado: IslaEstado;
    created_at: string;
    updated_at: string;
}

export interface CreateIslaPayload {
    numero_isla: number;
    equipos_computo: number;
    switches: number;
    routers: number;
    otros_componentes: Record<string,string>;
    estado: IslaEstado;
}

export type UpdateIslaPayload = Partial<CreateIslaPayload>;

export interface UseRef {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface Reservacion {
    id: number;
    isla: number;
    isla_detalles: Isla;
    alumno: UseRef;
    fecha_reserva: string;
    hora_inicio: string;
    duracion_horas: number;
    hora_escaneo_inicio: string | null;
    completada: boolean;
    cancelada: boolean;
    created_at: string;
    updated_at: string;
}

export interface Ocupacion {
    id: number;
    isla: number;
    fecha_reserva: string;
    hora_inicio: string;
    duracion_horas: number;
    es_mia: boolean;
}

export interface CreateReservacionPayload {
    isla: number;
    fecha_reserva: string;
    hora_inicio: string;
    duracion_horas: string;
}

export function getReservacionEstado(r:Reservacion): ReservacionEstado{
    if (r.cancelada) return 'Cancelada';
    if (r.completada) return 'Completada';

    const hoy = new Date().toISOString().split('T')[0];
    if (r.fecha_reserva < hoy && !r.hora_escaneo_inicio) return 'Expirada';

    return 'Activa';
}

export interface CalendarSlot {
    hora: string;
    lunes: Reservacion | null;
    martes: Reservacion | null;
    miercoles: Reservacion | null;
    jueves: Reservacion | null;
    viernes: Reservacion | null;
}

export interface HorarioBloqueado {
    id: number;
    isla:number | null;
    isla_numero: number | null;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    motivo: string;
    created_by: string;
    created_at: string;
}

export interface CreateHorarioBloqueadoPayload {
    isla: number | null;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    motivo: string;
}