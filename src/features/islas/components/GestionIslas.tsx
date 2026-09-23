'use client';

import { IoAdd } from "react-icons/io5";
import { useIslaModal } from "../hooks/useIslaModal";
import { useIslas } from "../hooks/useIslas";
import { useReservacionMOdal } from "../hooks/useReservacionModal";
import { CalendarioIslas } from "./CalendarioIslas";
import { PanelIslas } from "./PanelIslas";
import { IslaModal } from "./IslaModal";
import { ReservacionModal } from "./ReservacionModal";
import { TOKEN_KEYS } from "@/constants";
import { useBloqueoModal } from "../hooks/useBloqueoModal";
import { BloqueoModal } from "./BloqueoModal";
import { HistorialReservaciones } from "./HistorialReservaciones";
import type { SessionRole } from "@/utils/session";
import { getIslasOcupadasEnSlot } from "../utils/calendar";

interface GestionIslasProps {
    // Si se indica, evita depender de localStorage durante el render
    role?: SessionRole;
}

export function GestionIslas({ role }: GestionIslasProps = {}){
    const {
        islas, reservaciones, ocupacion, loading, error, semanaActual, semanaAnterior, semanaSiguiente, bloqueos, handleDeleteIsla, refetch
    } = useIslas();

    const isAdmin = role
        ? role === 'Administrador'
        : typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEYS.role) === 'Administrador' : false;

    const bloqueoModal = useBloqueoModal(refetch);
    const islaModal = useIslaModal(refetch);
    const reservModal = useReservacionMOdal(refetch);

    if (loading) {
        return (
            <div style={{ padding:'2rem', fontFamily:'Poppins', color:'#888'}}>
                Cargando islas...
            </div>
        );
    }

    return (
        <div style={{ width: '100%' }}>
            <div className="islas-header" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem'}}>
                <div>
                    <h1 style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'1.75rem', color: '#1a1a1a', marginBottom:'0.25rem' }}>
                        {isAdmin ? 'Gestión de Islas' : 'Islas'}
                    </h1>
                    <p style={{ fontFamily:'Poppins', color:'#888', fontSize:'0.875rem' }}>
                        {isAdmin ? 'Administra el estado y horarios de las islas.' : 'Visualiza el estado y disponibilidad de cada isla. Da clic en un horario libre para reservar.'}
                    </p>
                </div>

                {isAdmin && (
                    <button
                        onClick={islaModal.openCreate}
                        style={{ background:'linear-gradient(135deg, #f97316, #e53e6d)', color:'#fff', fontFamily:'Poppins', fontWeight:600, fontSize:'0.9rem', border:'none', borderRadius:'12px', padding:'0.65rem 1.25rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem', justifyContent:'center', width:'100%', maxWidth:'220px' }}
                    >
                        <IoAdd size={18} /> Agregar Isla
                    </button>
                )}
            </div>

            {error && (
                <div className="notification is-danger is-light" style={{ fontFamily:'Poppins', marginBottom:'1rem' }}>
                    {error}
                </div>
            )}

            <div className="gestion-islas-grid" style={{ display: 'grid', gridTemplateColumns:'minmax(0, 1fr) 220px', gap:'1.5rem', alignItems:'start', gridTemplateAreas: '"calendar panel"', width: '100%' }}>

                <div style={{ gridArea: 'calendar', minWidth: 0, width: '100%' }}>
                    <CalendarioIslas
                        semanaActual={semanaActual}
                        reservaciones={reservaciones}
                        bloqueos={bloqueos}
                        onAnterior={semanaAnterior}
                        onSiguiente={semanaSiguiente}
                        onSlotClick={reservModal.openModal}
                        onBloqueoClick={isAdmin ? bloqueoModal.openModal : undefined}
                        isAdmin={isAdmin}
                        ocupacion={isAdmin ? [] : ocupacion}
                        islas={islas}
                    />
                </div>

                <div style={{ gridArea: 'panel', minWidth: 0, width: '100%' }}>
                    <PanelIslas
                        islas={islas}
                        onDelete={handleDeleteIsla}
                        isAdmin={isAdmin}
                    />
                </div>
            </div>

            <HistorialReservaciones
                reservaciones={reservaciones}
                semanaActual={semanaActual}
                onRefetch={refetch}
                isAdmin={isAdmin}
            />

            {islaModal.open && (
                <IslaModal 
                    isEdit={islaModal.isEdit}
                    form={islaModal.form}
                    setForm={islaModal.setForm}
                    formErrors={islaModal.formErrors}
                    loading={islaModal.loading}
                    error={islaModal.error}
                    onClose={islaModal.close}
                    onSubmit={islaModal.handleSubmit}
                />
            )}

            {reservModal.open && (
                <ReservacionModal
                    slot={reservModal.slot}
                    form={reservModal.form}
                    setForm={reservModal.setForm}
                    formErrors={reservModal.formErrors}
                    loading={reservModal.loading}
                    error={reservModal.error}
                    islas={islas}
                    onClose={reservModal.close}
                    onSubmit={() => reservModal.handleSubmit(islas)}
                    islasOcupadas={reservModal.slot ? getIslasOcupadasEnSlot(ocupacion, reservModal.slot.fecha, reservModal.slot.hora) : []}
                />
            )}

            {bloqueoModal.open && (
                <BloqueoModal
                    fecha={bloqueoModal.fecha}
                    form={bloqueoModal.form}
                    setForm={bloqueoModal.setForm}
                    formErrors={bloqueoModal.formErrors}
                    loading={bloqueoModal.loading}
                    error={bloqueoModal.error}
                    islas={islas}
                    onClose={bloqueoModal.close}
                    onSubmit={bloqueoModal.handleSubmit}
                />
            )}
        </div>
    );
}