export interface Perfil {
    id: number;
    username: string;
    email:string;
    first_name:string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    is_superuser: boolean;
    date_joined: string;
    last_login: string | null;
    matricula: string | null;
    carrera: string | null;
    carrera_id: number | null;
    carrera_clave: string | null;
    cuatrimestre: number | null;
    grupo: number | null;
    // "ISC34"; null si falta carrera con clave, cuatrimestre o grupo
    grupo_escolar: string | null;
}

// El backend solo permite editar estos campos; username y rol son de solo lectura
export interface UpdatePerfilPayload {
    email?: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    // El alumno solo puede enviarlos una vez, si los tiene vacíos
    carrera?: number;
    cuatrimestre?: number;
    grupo?: number;
}