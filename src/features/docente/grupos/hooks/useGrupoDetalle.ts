'use client';

import { useState, useEffect, useCallback } from "react";
import { docenteService } from "../../services/docenteService";
import { useToast } from "@/components/ui/Toast/ToastContext";
import type { ClassGroup } from "../../types";

interface Usuario {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export function useGrupoDetalle(grupoId: number) {
    const { showToast } = useToast();
    const [ grupo, setGrupo ] = useState<ClassGroup | null>(null);
    const [ estudiantes, setEstudiantes] = useState<Usuario[]>([]);
    const [ loading, setLoading ] = useState(true);

    const fetchDetalle = useCallback(async () => {
        setLoading(true);
        try{
            const grupoData = await docenteService.getGrupoById(grupoId);
            setGrupo(grupoData);
            const estudiantesData = await docenteService.getEstudiantesDeGrupo(grupoData.students);
            setEstudiantes(estudiantesData);
        } catch (err) {
            showToast('Error al cargar el grupo.', 'error');
        } finally {
            setLoading(false);
        }
    }, [grupoId, showToast]);

    useEffect(() => { fetchDetalle(); }, [ fetchDetalle ]);

    return {
        grupo,
        estudiantes,
        loading
    };
}