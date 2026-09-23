import type { Reservacion, Ocupacion } from "../types";

export const HORAS = [
    '08:00','09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00' 
];

export const DIAS = ['lunes', 'martes', 'mièrcoles', 'jueves', 'viernes'] as const;
export type DiaSemana = typeof DIAS[number];

export function getLunesDeSemana(fecha: Date): Date {
  const año  = fecha.getFullYear();
  const mes  = fecha.getMonth();
  const dia  = fecha.getDate();
  const dow  = fecha.getDay(); // 0=dom, 1=lun ... 6=sab

  // Días a restar para llegar al lunes
  const diasRestar = dow === 0 ? 6 : dow - 1;

  return new Date(año, mes, dia - diasRestar);
}

export function formatDate(date: Date) : string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2,'0');
    const d = String(date.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
}

export function formatSemana(lunes: Date) : string {
    const viernes = new Date(
        lunes.getFullYear(),
        lunes.getMonth(),
        lunes.getDate() + 4
    );

    const lunesStr = lunes.toLocaleDateString('es-MX', {
        day: 'numeric',
        month:'long'
    });

    const viernesStr = viernes.toLocaleDateString('es-MX', {
        day:'numeric',
        month:'long',
        year:'numeric'
    });

    return `Semana del ${lunesStr} al ${viernesStr}`
}

export function normalizeHora(hora: string) : string {
    return hora.slice(0,5);
}

export function getReservacionesDeSemana(
  reservaciones: Reservacion[],
  lunes: Date
): Reservacion[] {
  const viernes = new Date(
    lunes.getFullYear(),
    lunes.getMonth(),
    lunes.getDate() + 4
  );

  const lunesStr   = formatDate(lunes);
  const viernesStr = formatDate(viernes);

  return reservaciones.filter((r) => {
    if (r.cancelada || r.completada) return false;
    return r.fecha_reserva >= lunesStr && r.fecha_reserva <= viernesStr;
  });
}

export function getReservacionEnSlot(
  reservaciones: Reservacion[],
  fecha: string,
  hora:  string
): Reservacion | null {
  return reservaciones.find((r) => {
    if (r.fecha_reserva !== fecha) return false;
    const horaReserva = normalizeHora(r.hora_inicio);
    return horaReserva === hora;
  }) ?? null;
}


// Islas ocupadas por otras personas en un horario (la ocupación no trae datos personales)
export function getIslasOcupadasEnSlot(ocupacion: Ocupacion[], fecha: string, hora: string): number[] {
  const horaSlot = parseInt(hora.slice(0, 2), 10);
  return ocupacion
    .filter((o) => {
      if (o.es_mia || o.fecha_reserva !== fecha) return false;
      const inicio = parseInt(o.hora_inicio.slice(0, 2), 10);
      return horaSlot >= inicio && horaSlot < inicio + o.duracion_horas;
    })
    .map((o) => o.isla);
}
