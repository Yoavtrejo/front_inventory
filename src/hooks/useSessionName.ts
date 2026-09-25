'use client';

import { useSyncExternalStore } from 'react';
import { getSessionName } from '@/utils/session';

const subscribeToNothing = () => () => {};

// Lee el nombre guardado al iniciar sesión sin provocar desajustes de hidratación
export function useSessionName(): string {
    return useSyncExternalStore(subscribeToNothing, getSessionName, () => '');
}
