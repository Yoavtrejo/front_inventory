export interface Usuario {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    is_superuser: boolean;
    date_joined: string;
    last_login: string | null;
}

export type RolUsuario = 'Administrador' | 'Docente' | 'Alumno';

export function getRolUsuario(user: Usuario): RolUsuario {
    if (user.is_superuser) return 'Administrador';
    if (user.is_staff) return 'Docente';
    return 'Alumno';
}

export function rolToFlags(rol: RolUsuario) : {is_superuser: boolean; is_staff: boolean;  } {
    return {
        is_superuser: rol === 'Administrador',
        is_staff: rol === 'Docente',
    };
}

export interface CreateUsuarioPayload {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    is_staff: boolean;
    is_active: boolean;
    is_superuser: boolean;
}

export interface UpdateUsuarioPayload {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    is_staff?: boolean;
    is_active?: boolean;
    is_superuser?: boolean;
}


