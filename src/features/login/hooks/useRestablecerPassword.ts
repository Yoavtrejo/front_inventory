'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { authService } from '../services/authService';

export function useRestablecerPassword() {
    const searchParams = useSearchParams();
    const uid = searchParams.get('uid') ?? '';
    const token = searchParams.get('token') ?? '';

    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const isLinkComplete = uid !== '' && token !== '';

    const handleSubmit = async () => {
        if (password !== passwordConfirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const detail = await authService.confirmPasswordReset({ uid, token, password, password_confirm: passwordConfirm });
            setSuccessMessage(detail || 'Tu contraseña se actualizó. Ya puedes iniciar sesión.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña.');
        } finally {
            setLoading(false);
        }
    };

    return {
        password, setPassword, passwordConfirm, setPasswordConfirm,
        loading, error, successMessage, isLinkComplete, handleSubmit,
    };
}
