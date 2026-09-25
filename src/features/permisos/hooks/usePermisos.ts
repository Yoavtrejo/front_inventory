'use client';

import { useEffect, useState, useCallback } from 'react';
import { permisosService } from '../services/permisosService';
import { useToast } from '@/components/ui/Toast/ToastContext';
import type { Usuario } from '../types';

export function usePermisos() {
    const { showToast } = useToast();
    const [ usuarios, setUsuarios ] = useState<Usuario[]>([]);
    const [ filtered, setFiltered ] = useState<Usuario[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ search, setSearch ] = useState('');

    const fetchUsuarios = useCallback(async () => {
        setLoading(true);
        try{
            const data = await permisosService.getAll();
            setUsuarios(data);
            setFiltered(data);
        }catch (err) {
            showToast (err instanceof Error ? err.message : 'Error al cargar usuarios', 'error');
        }finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

    useEffect(() => {
        if (!search.trim()){
            setFiltered(usuarios);
            return;
        }
        const term = search.toLowerCase();
        setFiltered(usuarios.filter((u) => u.first_name.toLowerCase().includes(term) || u.last_name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.username.toLowerCase().includes(term)));
    }, [search, usuarios]);

    const handleDelete = async (id: number) => {
        try {
            await permisosService.delete(id);
            setUsuarios((prev) => prev.filter((u) => u.id !== id));
            showToast('Usuario eliminado correctamente', 'success');
        }catch (err) {
            showToast(err instanceof Error ? err.message : 'Error al eliminar', 'error');
        }
    };

    return {
        usuarios: filtered,
        loading,
        search, 
        setSearch,
        refetch: fetchUsuarios,
        handleDelete,
    };
}