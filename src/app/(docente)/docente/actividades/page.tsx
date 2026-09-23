import type { Metadata } from 'next';
import { ActividadesDocente } from '@/features/docente';

export const metadata: Metadata = { title: 'Actividades | SIDERED' };

export default function DocenteActividadesPage() {
    return <ActividadesDocente />;
}
