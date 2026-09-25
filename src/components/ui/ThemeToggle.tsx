'use client';

import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const preferredTheme = savedTheme ?? (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', preferredTheme);
    setTheme(preferredTheme as 'light' | 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        width: '100%',
        border: '1px solid var(--border)',
        background: 'var(--surface-soft)',
        color: 'var(--text)',
        padding: '0.7rem 0.9rem',
        borderRadius: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
      <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  );
}
