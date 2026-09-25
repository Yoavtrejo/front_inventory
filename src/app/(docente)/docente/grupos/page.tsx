import type { Metadata } from 'next';
import { GruposDocente } from '@/features/docente';

export const metadata: Metadata = { title: 'Grupos | SIDERED' };

export default function DocenteGruposPage() {
    return <GruposDocente />;
}
