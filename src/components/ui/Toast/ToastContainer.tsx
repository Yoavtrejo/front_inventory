'use client';

import { IoCheckmarkCircle, IoWarning, IoInformationCircle, IoCloseCircle, IoClose } from 'react-icons/io5';
import type { IconType } from 'react-icons';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id:      number;
  message: string;
  type:    ToastType;
}

const TOAST_STYLES: Record<ToastType, {
  background: string;
  color:      string;
  border:     string;
  Icon:       IconType;
}> = {
  success: {
    background: '#f0fdf4',
    color:      '#065f46',
    border:     '#bbf7d0',
    Icon:       IoCheckmarkCircle,
  },
  error: {
    background: '#fef2f2',
    color:      '#991b1b',
    border:     '#fecaca',
    Icon:       IoCloseCircle,
  },
  warning: {
    background: '#fffbeb',
    color:      '#92400e',
    border:     '#fde68a',
    Icon:       IoWarning,
  },
  info: {
    background: '#eff6ff',
    color:      '#1e40af',
    border:     '#bfdbfe',
    Icon:       IoInformationCircle,
  },
};

interface ToastContainerProps {
  toasts:   Toast[];
  onRemove: (id: number) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position:      'fixed',
        bottom:        '1.5rem',
        right:         '1.5rem',
        zIndex:        9999,
        display:       'flex',
        flexDirection: 'column',
        gap:           '0.75rem',
        maxWidth:      '380px',
        width:         '90%',
      }}
    >
      {toasts.map((toast) => {
        const { background, color, border, Icon } = TOAST_STYLES[toast.type];

        return (
          <div
            key={toast.id}
            style={{
              background,
              border:       `1px solid ${border}`,
              borderRadius: '12px',
              padding:      '0.875rem 1rem',
              display:      'flex',
              alignItems:   'flex-start',
              gap:          '0.75rem',
              boxShadow:    '0 4px 16px rgba(0,0,0,0.1)',
              animation:    'slideIn 0.3s ease',
            }}
          >
            <Icon size={20} color={color} style={{ flexShrink: 0, marginTop: '1px' }} />

            <p style={{
              fontFamily: 'var(--font-poppins), sans-serif',
              fontSize:   '0.875rem',
              color,
              fontWeight: 500,
              flex:       1,
              margin:     0,
              lineHeight: '1.5',
            }}>
              {toast.message}
            </p>

            <button
              onClick={() => onRemove(toast.id)}
              style={{
                background:  'none',
                border:      'none',
                cursor:      'pointer',
                padding:     0,
                flexShrink:  0,
                opacity:     0.6,
                marginTop:   '1px',
              }}
            >
              <IoClose size={16} color={color} />
            </button>
          </div>
        );
      })}
    </div>
  );
}