'use client';

import { useState, useEffect, useCallback } from 'react';
import { docenteService } from '../../services/docenteService';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { TOKEN_KEYS } from '@/constants';
import type { ClassGroup } from '../../types';

export function useDocenteDashboard() {
  const { showToast } = useToast();
  const [grupos, setGrupos] = useState<ClassGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [first_name, setFirst_Name] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const docenteId = Number(first_name || 0);
      const data = await docenteService.getGrupos(docenteId);
      setGrupos(data);
    } catch (err) {
      showToast('Error al cargar grupos', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, setFirst_Name]);

  useEffect(() => {
    const name = localStorage.getItem(TOKEN_KEYS.name) ?? 'Docente';
    setFirst_Name(name);
    fetchData();
  }, [fetchData]);

  return { grupos, loading, first_name };
}