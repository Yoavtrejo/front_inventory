'use client';

import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import { TOKEN_KEYS } from '@/constants';
import { authService } from '@/features/login';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const refresh = localStorage.getItem(TOKEN_KEYS.refresh);
    if (refresh) await authService.logout(refresh).catch(() => undefined);
    Object.values(TOKEN_KEYS).forEach((key) => localStorage.removeItem(key));
    router.replace('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        border: '1px solid #fbcfe8',
        background: 'transparent',
        color: '#e53e6d',
        padding: '0.7rem 0.9rem',
        borderRadius: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <FiLogOut size={18} />
      <span>Cerrar sesión</span>
    </button>
  );
}
