import type { Metadata } from 'next';
import { Calendario } from '@/features/calendario';

export const metadata: Metadata = { title: 'Calendario | SIDERED' };

export default function DocenteCalendarioPage() {
    return <Calendario role="Docente" />;
}
