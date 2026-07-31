import { Modal } from './Modal';
import { ModalCancelButton, ModalSubmitButton } from './ModalButtons';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  variant?: 'primary' | 'danger';
}

export function ConfirmModal({ open, title, message, loading = false, onClose, onConfirm, confirmLabel = 'Confirmar', variant = 'danger' }: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      maxWidth="400px"
      footer={
        <>
          <ModalCancelButton onClick={onClose} />
          <ModalSubmitButton
            onClick={onConfirm}
            loading={loading}
            label={confirmLabel}
            loadingLabel="Procesando..."
            variant={variant}
          />
        </>
      }
    >
      <p style={{ fontFamily:'Poppins',fontSize:'0.9rem', color:'#555', textAlign:'center', lineHeight:'1.6' }}>
        {message}
      </p>
    </Modal>
  );
}