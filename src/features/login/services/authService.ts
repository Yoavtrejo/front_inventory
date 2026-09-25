import { API } from '@/constants';

interface LoginCredentials {
    username: string;
    password: string;
}

interface LoginResponse {
    access: string;
    refresh: string;
}

interface RegisterCredentials{
    first_name: string;
    last_name: string;
    matricula: string;
    email: string;
    password: string;
    password_confirm: string;
    carrera: number;
}

export interface Carrera {
    id: number;
    nombre: string;
}

interface ApiEnvelope<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface ConfirmPasswordResetPayload {
    uid: string;
    token: string;
    password: string;
    password_confirm: string;
}

async function postPublic(endpoint: string, payload: object, fallbackError: string): Promise<string> {
    const response = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => null) as ApiEnvelope<{ detail?: string }> | null;
    if (!response.ok) {
        if (response.status === 429) throw new Error('Demasiados intentos. Espera un momento e inténtalo de nuevo.');
        throw new Error(body?.message ?? fallbackError);
    }
    return body?.data?.detail ?? '';
}

export const authService = {
    login: async(credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await fetch(`${API}/token/`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        }

        return response.json() as Promise<LoginResponse>;
    },

    // /profile/ funciona para cualquier rol; /users/{id}/ solo para staff
    me: async(token: string) => {
        const response = await fetch(`${API}/profile/`, {
            method: 'GET',
            headers: { 
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener información del usuario.');
        }

        return response.json();
    },

    decodeToken: (token: string) => {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    },

    // Registro público: el backend siempre crea alumnos (username = matrícula)
    register: async(credentials: RegisterCredentials) => {
        const response = await fetch(`${API}/register/`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(credentials)
        });
        const body = await response.json().catch(() => null) as ApiEnvelope<unknown> | null;

        if (!response.ok) {
            throw new Error(body?.message ?? 'Error al registrar el usuario.');
        }

        return body?.data;
    },

    getCarreras: async(): Promise<Carrera[]> => {
        const response = await fetch(`${API}/carreras/`);
        const body = await response.json().catch(() => null) as ApiEnvelope<Carrera[]> | null;
        if (!response.ok) throw new Error(body?.message ?? 'No se pudieron cargar las carreras.');
        return body?.data ?? [];
    },

    // Siempre responde igual exista o no la cuenta, para no revelar quién está registrado
    requestPasswordReset: (identificador: string): Promise<string> =>
        postPublic('/password-reset/', { identificador }, 'No se pudo enviar el enlace de recuperación.'),

    confirmPasswordReset: (payload: ConfirmPasswordResetPayload): Promise<string> =>
        postPublic('/password-reset/confirm/', payload, 'No se pudo actualizar la contraseña.'),
}
