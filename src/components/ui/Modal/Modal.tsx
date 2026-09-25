'use client';

import type { ReactNode } from "react";

interface ModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
}

export function Modal({ open, title, onClose, children, footer, maxWidth = '460px'} : ModalProps) {
    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(17, 24, 39, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                zIndex: 1000,
            }}
        >
            <div className="modal-card" style={{ borderRadius:'16px', maxWidth, width:'90%', overflow:'hidden', background:'#fff', boxShadow:'0 20px 45px rgba(0,0,0,0.18)' }}>
                <header className="modal-card-head" style={{ borderRadius:'16px 16px 0 0', background:'#ffffff', borderBottom:'1px solid #f0f0f0', padding:'1rem 1.5rem  0.75rem', display:'flex', flexDirection:'column', alignItems:'center', position:'relative', minHeight:'80px' }}>
                    <div style={{ display:'flex', gap:'6px', position:'absolute', top:'1rem', left:'1.25rem'}}>
                        <span style={{ width:14, height:14, borderRadius:'50%', background:'#e53e6d', display:'block' }} />
                        <span style={{ width:14, height:14, borderRadius:'50%', background:'#f97316', display:'block' }} />
                        <span style={{ width:14, height:14, borderRadius:'50%', background:'#facc15', display:'block' }} />
                    </div>

                    <button
                        className="delete"
                        onClick={onClose}
                        style={{ position:'absolute', top:'1rem', right:'1.25rem' }}
                        aria-label="Cerrar modal"
                    />

                    <p style={{ fontFamily:'Poppins', fontSize:'1.25rem', fontWeight:700, color:'#111827', margin:'0.5rem 0 0', textAlign:'center' }}>
                        {title}
                    </p>
                </header>

                <section className="modal-card-body" style={{ padding:'1.25rem 1.5rem' }}>
                    {children}
                </section>

                {footer && (
                    <footer className="modal-card-foot" style={{ borderRadius:'0 0 16px 16px', background:'#fff', borderTop:'1px solid #f0f0f0', justifyContent:'flex-end', gap:'0.75rem', padding:'1rem 1.5rem' }}>
                        {footer}
                    </footer>
                )}
            </div>
        </div>
    );
}