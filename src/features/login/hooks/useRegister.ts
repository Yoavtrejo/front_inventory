'use client';

import { useState } from 'react';
import { authService } from '../services/authService';
import { useRouter } from 'next/navigation';

export function useRegister(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    //const [carrer, setCarrer] = useState('');
    

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleRegister = async () => {
        setLoading(true);
        setError(null);
        try {
            await authService.register({
                username,
                email,
                first_name: firstName,
                last_name: lastName,
                password,
                is_active: true, 
                is_staff: false, 
                is_superuser: false,
                // carrer
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
        //carrer,
        //setCarrer,
        loading,
        error,
        handleRegister
    }

}