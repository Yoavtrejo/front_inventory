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
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    is_active: boolean;
    is_staff: boolean;
    is_superuser: boolean;
    //carrer: string;
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

    register: async(credentials: RegisterCredentials) => {
        const response = await fetch(`${API}/users/`, {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error('Error al registrar el usuario.');
        }

        return response.json();
    }
}

