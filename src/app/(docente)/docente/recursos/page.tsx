import type { Metadata } from 'next';
import { Recursos } from '@/features/recursos';

export const metadata: Metadata = { title: 'Recursos | SIDERED' };

export default function DocenteRecursosPage() {
    return <Recursos canManage />;
}
