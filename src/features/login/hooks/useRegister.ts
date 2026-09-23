'use client';

import { useEffect, useState } from 'react';
import { authService, type Carrera } from '../services/authService';
import { useRouter } from 'next/navigation';

export function useRegister(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [carrera, setCarrera] = useState<number | null>(null);
    const [carreras, setCarreras] = useState<Carrera[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        let isActive = true;
        authService.getCarreras()
            .then((data) => { if (isActive) setCarreras(data); })
            .catch((err: unknown) => {
                if (isActive) setError(err instanceof Error ? err.message : 'No se pudieron cargar las carreras.');
            });
        return () => { isActive = false; };
    }, []);

    const handleRegister = async () => {
        if (password !== passwordConfirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (carrera === null) {
            setError('Selecciona tu carrera.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await authService.register({
                first_name: firstName,
                last_name: lastName,
                matricula: username.trim(),
                email,
                password,
                password_confirm: passwordConfirm,
                carrera,
            });
            router.push('/login');
        } catch (err) {
            const mensaje = err instanceof Error ? err.message : 'Error inesperado. Intentar de nuevo.';
            setError(mensaje);
        } finally {
            setLoading(false);
        }
    }

    return {
        username,
        setUsername,
        email,
        setEmail,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm,
        carrera,
        setCarrera,
        carreras,
        loading,
        error,
        handleRegister
    }

}
