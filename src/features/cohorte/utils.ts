import type { Carrera, CohorteValue } from './types';

export const CUATRIMESTRES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const GRUPOS = [1, 2, 3, 4, 5, 6] as const;

export const EMPTY_COHORTE: CohorteValue = { carrera: null, cuatrimestre: null, grupo: null };

export function isCohorteComplete(value: CohorteValue): boolean {
    return value.carrera !== null && value.cuatrimestre !== null && value.grupo !== null;
}

// "ISC34" si la carrera tiene clave y están los tres datos; null si falta algo
export function grupoEscolarLabel(carreras: Carrera[], value: CohorteValue): string | null {
    const carrera = carreras.find((candidate) => candidate.id === value.carrera);
    if (!carrera?.clave || value.cuatrimestre === null || value.grupo === null) return null;
    return `${carrera.clave}${value.cuatrimestre}${value.grupo}`;
}
