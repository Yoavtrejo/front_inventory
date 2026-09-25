import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';

// Tarjeta y estilos compartidos por las pantallas de recuperación (mismo diseño que el login)
export const AUTH_LABEL_STYLE: CSSProperties = { fontFamily: 'Poppins', fontWeight: 400, fontSize: '0.875rem', color: '#555' };
export const AUTH_INPUT_STYLE: CSSProperties = { fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' };

export function authButtonStyle(loading: boolean): CSSProperties {
    return {
        backgroundColor: '#d81e5b', color: '#ffffff', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.95rem',
        borderRadius: '20px', border: 'none', height: '44px', letterSpacing: '0.01em', transition: 'opacity 0.2s',
        opacity: loading ? 0.75 : 1,
    };
}

interface AuthCardProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
    return (
        <div style={{ background: '#ffffff', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0, 0, 0, 0.13)', padding: '2.5rem 2.25rem 2rem' }}>
            <h1 className="title is-4 has-text-centered" style={{ fontFamily: 'Poppins', fontWeight: 600, marginBottom: '0.4rem', color: '#1a1a1a' }}>
                {title}
            </h1>
            <p className="has-text-centered" style={{ fontFamily: 'Poppins', fontWeight: 300, fontSize: '0.875rem', color: '#888', marginBottom: '2rem', lineHeight: '1.5' }}>
                {subtitle}
            </p>
            {children}
            <p className="has-text-centered" style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: '0.85rem', color: '#888', marginTop: '1.25rem' }}>
                <Link href="/login" style={{ color: '#d81e5b', fontWeight: 500 }}>
                    Volver a iniciar sesión
                </Link>
            </p>
        </div>
    );
}

export function AuthNotice({ message }: { message: string }) {
    return (
        <div className="notification is-success is-light" style={{ fontFamily: 'Poppins', fontSize: '0.875rem' }}>
            {message}
        </div>
    );
}
