// ¿Tienes exactamente esto?
import { Suspense }      from 'react';
import type { Metadata } from 'next';
import { Prestamos } from '@/features/prestamos/components/Prestamos';

export const metadata: Metadata = { title: 'Préstamos | SIGELARED' };

export default function PrestamosPage() {
    return (
        <Suspense fallback={
            <div style={{ fontFamily: 'Poppins', padding: '2rem', color: '#888' }}>
                Cargando...
            </div>
        }>
            <Prestamos />
        </Suspense>
    );
}