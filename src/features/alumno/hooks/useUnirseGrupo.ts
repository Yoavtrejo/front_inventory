'use client';

import { useState } from 'react';
import { academicService } from '@/features/academic';
import { useToast } from '@/components/ui/Toast/ToastContext';
import { getApiErrorMessage } from '@/utils/apiResponse';

export function useUnirseGrupo(onJoined: () => void) {
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
    const [joining, setJoining] = useState(false);

    const open = () => {
        setSelectedGroupId(null);
        setIsOpen(true);
    };

    const close = () => setIsOpen(false);

    const join = async () => {
        if (selectedGroupId === null) {
            showToast('Selecciona un grupo.', 'warning');
            return;
        }
        setJoining(true);
        try {
            await academicService.joinGroup(selectedGroupId);
            showToast('Te uniste al grupo.', 'success');
            setIsOpen(false);
            onJoined();
        } catch (err) {
            showToast(getApiErrorMessage(err, 'No se pudo unir al grupo.'), 'error');
        } finally {
            setJoining(false);
        }
    };

    return { isOpen, open, close, selectedGroupId, setSelectedGroupId, joining, join };
}
