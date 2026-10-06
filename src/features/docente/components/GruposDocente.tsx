'use client';

import Link from 'next/link';
import { IoAdd, IoPeople, IoPeopleOutline } from 'react-icons/io5';
import { useAcademicData } from '@/features/academic';
import { PageHeader, PRIMARY_BUTTON_STYLE, CARD_STYLE, EmptyState } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal/Modal';
import { ModalCancelButton, ModalSubmitButton } from '@/components/ui/Modal/ModalButtons';
import { CohorteFields, useCarreras } from '@/features/cohorte';
import { useCrearGrupo } from '../hooks/useCrearGrupo';

export function GruposDocente() {
    const { groups, activities, loading, error, reload } = useAcademicData('Docente');
    const crearGrupo = useCrearGrupo(reload);
    const { carreras } = useCarreras();

    return (
        <div style={{ width: '100%' }}>
            <PageHeader
                title="Gestión de Grupos"
                subtitle="Administra los grupos asignados."
                action={(
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button onClick={crearGrupo.open} style={{ ...PRIMARY_BUTTON_STYLE }}>
                            <IoAdd size={18} /> Crear grupo
                        </button>
                        <Link href="/docente/grupos/equipos" style={{ ...PRIMARY_BUTTON_STYLE, textDecoration: 'none', background: '#fce7f3', color: '#9d174d' }}>
                            <IoPeopleOutline size={18} /> Crear Equipos
                        </Link>
                    </div>
                )}
            />

            {error && <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} style={{ height: '140px', borderRadius: '16px', background: 'var(--border)' }} />
                    ))
                    : groups.map((group) => (
                        <Link key={group.id} href={`/docente/grupos/${group.id}`} style={{ ...CARD_STYLE, textDecoration: 'none', display: 'block' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: '#e53e6d' }}>{group.name}</span>
                                <IoPeople size={20} color="#f97316" />
                            </div>
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: '0 0 0.25rem' }}>
                                <strong>Materia:</strong> {group.subject_name}
                            </p>
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)', margin: '0 0 0.25rem' }}>
                                <strong>Periodo:</strong> {group.term_name}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Poppins', fontSize: '0.85rem', color: 'var(--text-soft)' }}>
                                <span><strong>Alumnos:</strong> {group.students.length}</span>
                                <span><strong>Actividades:</strong> {activities.filter((activity) => activity.group === group.id).length}</span>
                            </div>
                        </Link>
                    ))}
            </div>

            {!loading && groups.length === 0 && <EmptyState message="Aún no tienes grupos. Crea uno con «Crear grupo» y tus alumnos se inscribirán solos." />}

            <Modal
                open={crearGrupo.isOpen}
                title="Crear grupo"
                onClose={crearGrupo.close}
                footer={(
                    <>
                        <ModalCancelButton onClick={crearGrupo.close} />
                        <ModalSubmitButton onClick={crearGrupo.save} loading={crearGrupo.saving} label="Crear" loadingLabel="Creando..." />
                    </>
                )}
            >
                <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#555', marginBottom: '1rem' }}>
                    Se crea en el cuatrimestre activo. Los alumnos de ese grupo escolar quedan inscritos automáticamente.
                </p>
                <div className="field">
                    <label style={{ fontFamily: 'Poppins', fontSize: '0.85rem', fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: '0.35rem' }}>Materia</label>
                    <div className="select is-fullwidth">
                        <select
                            value={crearGrupo.subjectId ?? ''}
                            onChange={(e) => crearGrupo.setSubjectId(e.target.value ? Number(e.target.value) : null)}
                            style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' }}
                        >
                            <option value="">Selecciona una opción</option>
                            {crearGrupo.subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                        </select>
                    </div>
                </div>
                <CohorteFields value={crearGrupo.cohorte} onChange={crearGrupo.setCohorte} carreras={carreras} />
                {crearGrupo.error && <p className="help is-danger" style={{ fontFamily: 'Poppins', marginTop: '0.75rem' }}>{crearGrupo.error}</p>}
            </Modal>
        </div>
    );
}
