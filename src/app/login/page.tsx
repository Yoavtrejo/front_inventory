import { FormLogin } from '@/features/login';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Iniciar Sesión',
    description: 'Pantalla de inicio de sesión del sistema de inventario',
};

export default function LoginPage() {
    return (
        <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
            
            {/* Fondo degradado */}
            <div style={{ position: 'absolute', inset: 0, background:'linear-gradient(135deg, #fef9c3 0%, #fde68a 15%, #fbcfe8 45%, #ddd6fe 70%, #bfdbfe 100%)', zIndex: 0,}}/>

            <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0,}} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,400 Q200,200 400,400 T800,400 T1200,400 T1600,400" stroke="#fbbf24" strokeWidth="130" fill="none" opacity="0.28"/>
                <path d="M-100,600 Q200,350 500,600 T1100,600 T1700,600" stroke="#a78bfa" strokeWidth="110" fill="none" opacity="0.28"/>
                <path d="M0,200 Q300,450 600,200 T1200,200 T1800,200" stroke="#93c5fd" strokeWidth="90" fill="none" opacity="0.22"/>
                <path d="M200,700 Q500,450 800,700 T1400,700" stroke="#f9a8d4" strokeWidth="100" fill="none" opacity="0.28"/>
                <path d="M300,150 Q600,350 900,150 T1500,150" stroke="#fbbf24" strokeWidth="70" fill="none" opacity="0.18"/>
            </svg>

            {/* Card del formulario */}
            <div style={{position: 'relative',zIndex: 1,width: '100%',maxWidth: '440px',padding: '1rem',}}>
                <FormLogin />
            </div>
        </div>
    );
}