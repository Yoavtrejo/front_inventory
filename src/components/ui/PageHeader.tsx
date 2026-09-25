import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
                <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.75rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
                    {title}
                </h1>
                <p style={{ fontFamily: 'Poppins', color: '#888', fontSize: '0.875rem' }}>
                    {subtitle}
                </p>
            </div>
            {action}
        </div>
    );
}

export const PRIMARY_BUTTON_STYLE = {
    background: 'linear-gradient(135deg, #f97316, #e53e6d)', color: '#fff', fontFamily: 'Poppins', fontWeight: 600,
    fontSize: '0.9rem', border: 'none', borderRadius: '12px', padding: '0.65rem 1.25rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center',
} as const;

export const CARD_STYLE = {
    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px',
    padding: '1.25rem 1.5rem', boxShadow: 'var(--shadow)',
} as const;

export function EmptyState({ message }: { message: string }) {
    return (
        <div style={{ textAlign: 'center', fontFamily: 'Poppins', color: '#aaa', padding: '3rem' }}>
            {message}
        </div>
    );
}
