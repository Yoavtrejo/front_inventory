import { RoleLayout } from '@/components/layout/RoleLayout';
import { CompletarGrupo } from '@/features/alumno';

export default function AlumnoLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleLayout role="Alumno">
      <CompletarGrupo />
      {children}
    </RoleLayout>
  );
}
