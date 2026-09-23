import type { Metadata } from 'next';
import { ActividadesAlumno } from '@/features/alumno';

export const metadata: Metadata = { title: 'Actividades | SIDERED' };

export default function AlumnoActividadesPage() {
    return <ActividadesAlumno />;
}
