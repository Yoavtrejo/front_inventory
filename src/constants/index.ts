export const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export const TOKEN_KEYS = {
    access:  'accessToken',
    refresh: 'refreshToken',
    role:    'userRole',
    name:    'userName',
} as const;