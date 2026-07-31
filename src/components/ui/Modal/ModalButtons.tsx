interface ModalCancelButtonProps {
  onClick:   () => void;
  label?:    string;
}

interface ModalSubmitButtonProps {
  onClick:   () => void;
  loading?:  boolean;
  disabled?: boolean;
  label?:    string;
  loadingLabel?: string;
  variant?:  'primary' | 'danger'; 
}

export function ModalCancelButton({ onClick, label = 'Cancelar' }: ModalCancelButtonProps) {
  return (
    <button
      className="button"
      onClick={onClick}
      style={{ fontFamily: 'Poppins', borderRadius: '8px' }}
    >
      {label}
    </button>
  );
}

export function ModalSubmitButton({ onClick, loading = false, disabled = false, label = 'Guardar', loadingLabel = 'Guardando...', variant = 'primary' }: ModalSubmitButtonProps) {
  const background = variant === 'danger' ? 'linear-gradient(135deg, #991b1b, #e53e6d)' : 'linear-gradient(135deg, #f97316, #e53e6d)';

  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      style={{ background, color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', borderRadius: '8px', border: 'none', padding: '0.5rem 1.25rem', cursor: loading || disabled ? 'not-allowed' : 'pointer', opacity: loading || disabled ? 0.75 : 1, transition: 'opacity 0.2s'}}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}