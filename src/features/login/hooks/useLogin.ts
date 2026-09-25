"use client";
import { useState } from 'react';
import { authService } from '../services/authService';
import { useRouter } from 'next/navigation';
import { TOKEN_KEYS } from '@/constants';

export function useLogin(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const rutas: Record<string, string> = {
        Administrador: '/admin/dashboard',
        Docente: '/docente/dashboard',
        Alumno: '/alumno/dashboard'
    }; 

    const handleLogin = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await authService.login({ username, password });
            const user= await authService.me(data.access);
            const rol = user.is_superuser 
                ? 'Administrador' 
                : user.is_staff
                    ? 'Docente' 
                    : 'Alumno';

            localStorage.setItem(TOKEN_KEYS.access, data.access);
            localStorage.setItem(TOKEN_KEYS.refresh, data.refresh);
            localStorage.setItem(TOKEN_KEYS.name, user.first_name ? `${user.first_name} ${user.last_name}`.trim() : user.username);
            localStorage.setItem(TOKEN_KEYS.role, rol);
            router.push(rutas[rol]);
        }catch (err){
            const mensaje = err instanceof Error ? err.message : 'Error inesperado. Intenta de nuevo';
            setError(mensaje);
        }finally {
            setLoading(false);
        }
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleLogin
    };
}