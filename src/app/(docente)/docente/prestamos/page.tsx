import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Prestamos } from '@/features/prestamos';

export const metadata: Metadata = { title: 'Préstamos | SIDERED' };

export default function DocentePrestamosPage() {
    return (
        <Suspense fallback={<div style={{ fontFamily: 'Poppins', padding: '2rem', color: '#888' }}>Cargando...</div>}>
            <Prestamos role="Docente" />
        </Suspense>
    );
}
