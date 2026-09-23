import { RoleLayout } from '@/components/layout/RoleLayout';
import { ADMIN_NAV } from '@/constants/navigations';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="Administrador" navItems={ADMIN_NAV}>{children}</RoleLayout>;
}
