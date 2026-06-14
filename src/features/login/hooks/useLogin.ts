"use client";
import { useState } from 'react';
import { authService } from '../services/authService';
import { useRouter } from 'next/navigation';

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
            const userInfo = authService.decodeToken(data.access);
            const user= await authService.me(userInfo.user_id, data.access);
            const rol = user.is_superuser 
                ? 'Administrador' 
                : user.is_staff
                    ? 'Docente' 
                    : 'Alumno';

            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            localStorage.setItem('userName', user.username || user.first_name);
            localStorage.setItem('userRole', rol);
            router.push(rutas[rol]);
        }catch (err){
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
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