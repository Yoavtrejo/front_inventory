import type { Metadata } from 'next';
import { GestionCarreras } from '@/features/cohorte';

export const metadata: Metadata = { title: 'Carreras | SIDERED' };

export default function AdminCarrerasPage() {
    return <GestionCarreras />;
}
