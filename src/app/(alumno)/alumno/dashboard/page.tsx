import type { Metadata } from 'next';
import { AlumnoDashboard } from '@/features/alumno';

export const metadata: Metadata = { title: 'Inicio | SIDERED' };

export default function AlumnoDashboardPage() {
    return <AlumnoDashboard />;
}
