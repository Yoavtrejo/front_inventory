import type { Metadata } from 'next';
import { MiPerfil } from '@/features/perfil';

export const metadata: Metadata = { title: 'Mi Perfil | SEDERED' };

export default function PerfilPage() {
  return <MiPerfil />;
}