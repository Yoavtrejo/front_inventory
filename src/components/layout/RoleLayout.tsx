'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { Sidebar } from '@/components/ui/Sidebar/Sidebar';
import { ToastProvider } from '@/components/ui/Toast/ToastContext';
import { TOKEN_KEYS } from '@/constants';
import { ADMIN_NAV, DOCENTE_NAV, ALUMNO_NAV, type NavItem } from '@/constants/navigations';
import type { SessionRole } from '@/utils/session';

// Los íconos son funciones y no pueden pasar de un layout de servidor a este componente
const NAV_BY_ROLE: Record<SessionRole, NavItem[]> = {
  Administrador: ADMIN_NAV,
  Docente: DOCENTE_NAV,
  Alumno: ALUMNO_NAV,
};

interface RoleLayoutProps {
  role: SessionRole;
  children: ReactNode;
}

export function RoleLayout({ role, children }: RoleLayoutProps) {
  const navItems = NAV_BY_ROLE[role];
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem(TOKEN_KEYS.role);
    if (storedRole !== role) router.replace('/login');
  }, [router, role]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <ToastProvider>
      <div style={{ display: 'flex', minHeight: '100vh', width: '100%', background: 'var(--bg)' }}>
        <Sidebar items={navItems} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 50,
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: 42,
            height: 42,
            borderRadius: 12,
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            boxShadow: 'var(--shadow)',
            cursor: 'pointer',
          }}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Abrir menú"
          className="admin-mobile-toggle"
        >
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </div>

        <main
          style={{
            flex: 1,
            width: '100%',
            padding: '1rem',
            overflow: 'auto',
            minWidth: 0,
            background: 'var(--bg)',
          }}
          className="admin-main"
        >
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
