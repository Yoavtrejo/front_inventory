export interface Carrera {
    id: number;
    nombre: string;
    // Abreviatura con la que se forma el nombre del grupo escolar, p. ej. "ISC"
    clave: string | null;
}

export interface CarreraPayload {
    nombre: string;
    clave: string;
}

// Grupo escolar: carrera + cuatrimestre (1–9) + grupo (1–6) → "ISC34"
export interface CohorteValue {
    carrera: number | null;
    cuatrimestre: number | null;
    grupo: number | null;
}
