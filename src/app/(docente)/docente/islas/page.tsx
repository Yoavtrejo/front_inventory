import type { Metadata } from 'next';
import { GestionIslas } from '@/features/islas';

export const metadata: Metadata = { title: 'Islas | SIDERED' };

export default function DocenteIslasPage() {
    return <GestionIslas role="Docente" />;
}
