import type { Metadata } from 'next';
import { MiPerfil } from '@/features/perfil';

export const metadata: Metadata = { title: 'Mi Perfil | SIDERED' };

export default function AlumnoPerfilPage() {
    return <MiPerfil />;
}
