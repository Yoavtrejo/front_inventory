import { RoleLayout } from '@/components/layout/RoleLayout';
import { DOCENTE_NAV } from '@/constants/navigations';

export default function DocenteLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="Docente" navItems={DOCENTE_NAV}>{children}</RoleLayout>;
}
