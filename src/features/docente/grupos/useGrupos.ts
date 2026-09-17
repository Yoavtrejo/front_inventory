'use client';

import { useState, useEffect, useCallback } from "react";
import { docenteService } from "../services/docenteService";
import { useToast } from "@/components/ui/Toast/ToastContext";
import type { ClassGroup } from "../types";

export function useGrupos() {
    const { showToast } = useToast();
    const [ grupos, setGrupos ] = useState<ClassGroup[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ search, setSearch ] = useState('');

    const fetchGrupos = useCallback(async () => {
        setLoading(true);
        try{
            const data = await docenteService.getGrupos(0);
            setGrupos(data);
        } catch (err) {
            showToast('Error al cargar grupos.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { fetchGrupos(); }, [fetchGrupos]);

    const gruposFiltrados = grupos.filter((g) => {
        if (!search.trim()) return true;
        const term = search.toLowerCase();
        return (
            g.name.toLowerCase().includes(term) ||
            g.subject_name.toLowerCase().includes(term) ||
            g.term_name.toLowerCase().includes(term)
        );
    });

    return {
        grupos: gruposFiltrados,
        loading,
        search,
        setSearch,
        refetch: fetchGrupos
    }
}