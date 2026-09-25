'use client';

import { useState } from 'react';
import { authService } from '../services/authService';

export function useRecuperarPassword() {
    const [identificador, setIdentificador] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!identificador.trim()) {
            setError('Escribe tu matrícula.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const detail = await authService.requestPasswordReset(identificador.trim());
            setSuccessMessage(detail || 'Si la cuenta existe, enviamos un enlace de recuperación al correo registrado.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo enviar el enlace de recuperación.');
        } finally {
            setLoading(false);
        }
    };

    return { identificador, setIdentificador, loading, error, successMessage, handleSubmit };
}
