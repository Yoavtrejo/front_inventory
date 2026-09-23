import { Suspense } from 'react';
import type { Metadata } from 'next';
import { CrearEquipos } from '@/features/docente';

export const metadata: Metadata = { title: 'Crear Equipos | SIDERED' };

export default function DocenteCrearEquiposPage() {
    return (
        <Suspense fallback={<div style={{ fontFamily: 'Poppins', padding: '2rem', color: '#888' }}>Cargando...</div>}>
            <CrearEquipos />
        </Suspense>
    );
}
