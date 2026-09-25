import { TOKEN_KEYS } from '@/constants';

export type SessionRole = 'Administrador' | 'Docente' | 'Alumno';

export const ROLE_BASE_PATH: Record<SessionRole, string> = {
    Administrador: '/admin',
    Docente:       '/docente',
    Alumno:        '/alumno',
};

export function getSessionUserId(): number | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(TOKEN_KEYS.access);
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1])) as { user_id?: number | string };
        return payload.user_id !== undefined ? Number(payload.user_id) : null;
    } catch {
        return null;
    }
}

export function getSessionRole(): SessionRole | null {
    if (typeof window === 'undefined') return null;
    const role = localStorage.getItem(TOKEN_KEYS.role);
    return role === 'Administrador' || role === 'Docente' || role === 'Alumno' ? role : null;
}

export function getSessionName(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(TOKEN_KEYS.name) ?? '';
}
