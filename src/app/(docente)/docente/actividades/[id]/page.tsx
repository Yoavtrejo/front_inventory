import type { Metadata } from 'next';
import { RevisarActividad } from '@/features/docente';

export const metadata: Metadata = { title: 'Revisar Actividad | SIDERED' };

export default async function DocenteRevisarActividadPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <RevisarActividad activityId={Number(id)} />;
}
