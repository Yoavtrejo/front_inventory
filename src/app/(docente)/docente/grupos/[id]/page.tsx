import type { Metadata } from 'next';
import { GrupoDetalle } from '@/features/docente';

export const metadata: Metadata = { title: 'Grupo | SIDERED' };

export default async function DocenteGrupoDetallePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <GrupoDetalle groupId={Number(id)} />;
}
