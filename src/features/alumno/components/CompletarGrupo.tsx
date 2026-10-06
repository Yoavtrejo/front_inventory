'use client';

import { Modal } from '@/components/ui/Modal/Modal';
import { ModalCancelButton, ModalSubmitButton } from '@/components/ui/Modal/ModalButtons';
import { CohorteFields, useCarreras } from '@/features/cohorte';
import { useCompletarGrupo } from '../hooks/useCompletarGrupo';

export function CompletarGrupo() {
    const { isMissing, value, setValue, saving, error, savedLabel, save, finish, dismiss } = useCompletarGrupo();
    const { carreras } = useCarreras();

    if (!isMissing) return null;

    return (
        <Modal
            open
            title={savedLabel ? '¡Listo!' : 'Completa tu grupo'}
            onClose={savedLabel ? finish : dismiss}
            footer={savedLabel
                ? <ModalSubmitButton onClick={finish} label="Continuar" />
                : (
                    <>
                        <ModalCancelButton onClick={dismiss} label="Más tarde" />
                        <ModalSubmitButton onClick={save} loading={saving} label="Guardar" />
                    </>
                )}
        >
            {savedLabel ? (
                <p style={{ fontFamily: 'Poppins', fontSize: '0.9rem', color: '#555', textAlign: 'center' }}>
                    Quedaste en el grupo <strong style={{ color: '#e53e6d' }}>{savedLabel}</strong>. Ya estás inscrito en las materias de tu grupo.
                </p>
            ) : (
                <>
                    <p style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: '#555', marginBottom: '1rem' }}>
                        Indica tu cuatrimestre y grupo para inscribirte automáticamente en las materias de tu grupo. Solo se pide una vez; para cambiarlo después habla con el administrador.
                    </p>
                    <CohorteFields value={value} onChange={setValue} carreras={carreras} />
                    {error && <p className="help is-danger" style={{ fontFamily: 'Poppins', marginTop: '0.75rem' }}>{error}</p>}
                </>
            )}
        </Modal>
    );
}
