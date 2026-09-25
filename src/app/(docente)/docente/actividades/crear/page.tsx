import type { Metadata } from 'next';
import { CrearActividad } from '@/features/docente';

export const metadata: Metadata = { title: 'Crear Actividad | SIDERED' };

export default function DocenteCrearActividadPage() {
    return <CrearActividad />;
}
