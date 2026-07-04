'use client';

import { useState, useEffect, useCallback } from "react";
import { inventarioService } from "../services/inventarioService";
import { Material } from "../types";

export function useInventario(){
    const [materials, setMaterials] = useState<Material[]>([]);
    const [filtered, setFiltered] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');

    const fetchMaterials = useCallback(async () => {
        setLoading(true);
        setError(null);
        try{
            const data = await inventarioService.getAll();
            setMaterials(data);
            setFiltered(data);
        }catch (err){
            setError(err instanceof Error ? err.message : 'Error al cargar materiales');
        }finally{
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    useEffect(() => {
        if (!search.trim()){
            setFiltered(materials);
            return;
        }
        const term = search.toLowerCase();
        setFiltered(
            materials.filter((m) => m.name.toLowerCase().includes(term) || m.description.toLowerCase().includes(term) || m.status.toLowerCase().includes(term))
        );
    }, [search, materials]);

    const handleDelete = async (id:number) => {
        try{
            await inventarioService.delete(id);
            setMaterials((prev) => prev.filter((m) => m.id !== id));
        }catch (err){
            const mensaje = err instanceof Error ? err.message : 'Error al eliminar';
            setError(mensaje)
        }
    };

    return {
        materials: filtered,
        loading,
        error,
        search,
        setSearch,
        refetch: fetchMaterials,
        handleDelete
    };
}