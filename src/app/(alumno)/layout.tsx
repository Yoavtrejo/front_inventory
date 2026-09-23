import { RoleLayout } from '@/components/layout/RoleLayout';
import { ALUMNO_NAV } from '@/constants/navigations';

export default function AlumnoLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="Alumno" navItems={ALUMNO_NAV}>{children}</RoleLayout>;
}
