import { RoleLayout } from '@/components/layout/RoleLayout';

export default function DocenteLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role="Docente">{children}</RoleLayout>;
}
