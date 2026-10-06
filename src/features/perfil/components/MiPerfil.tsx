'use client';

import { IoPersonOutline, IoPencil, IoClose, IoSave } from 'react-icons/io5';
import { usePerfil } from '../hooks/usePerfil';
import { getRolUsuario } from '@/features/permisos/types';

const ROL_STYLES = {
    Administrador: { background: '#FEF3C7', color: '#92400E' },
    Docente: { background: '#D1FAE5', color: '#065F46' },
    Alumno: { background: '#DBEAFE', color: '#1E40AF' },
};

export function MiPerfil() {
    const {
        perfil, loading,
        saving, editMode,
        setEditMode, form,
        setForm, formErrors,
        handleSave, handleCancel,
    } = usePerfil();

    if (loading) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'Poppins', color: '#888' }}>
                Cargando Perfil...
            </div>
        );
    }

    if (!perfil) return null;

    const rol = getRolUsuario(perfil);
    const rolStyle = ROL_STYLES[rol];
    const ultimoAcceso = perfil.last_login ? new Date(perfil.last_login).toLocaleString('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }) : 'Nunca';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.75rem', color: '#1A1A1A', marginBottom: '0.25rem' }}>
                        Mi Perfil
                    </h1>
                    <p style={{ fontFamily: 'Poppins', color: '#888', fontSize: '0.875rem' }}>
                        Administra tu información personal y credenciales de acceso.
                    </p>
                </div>
                {!editMode ? (
                    <button
                        onClick={() => setEditMode(true)}
                        style={{ background: 'linear-gradient(135deg, #F97316, #E53E6D', color: '#FFF', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', border: 'none', borderRadius: '12px', padding: '0.65rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <IoPencil /> Editar Perfil
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                            onClick={handleCancel}
                            style={{ background: '#FFF', color: '#555', fontFamily: 'Poppins', fontWeight: 500, fontSize: '0.9rem', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '0.65rem 1.25rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.75 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <IoClose /> Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={{ background: 'linear-gradient(135deg, #F97316, #E53E6D)', color: '#FFF', fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.9rem', border: 'none', borderRadius: '12px', padding: '0.65rem 1.25rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.75 : 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <IoSave /> {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem', alignItems: 'start' }}>
                <div style={{ background: '#FFF', borderRadius: '16px', padding: '2rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #F97316, #E53E6D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IoPersonOutline size={48} color='#FFF' />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.1rem', color: '#1A1A1A', margin: 0 }}>
                            {perfil.first_name} {perfil.last_name}
                        </p>
                        <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#888', margin: '0.25rem 0 0' }}>
                            @{perfil.username}
                        </p>
                    </div>
                    <span style={{ ...rolStyle, fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600, borderRadius: '20ps', padding: '0.3rem 1rem' }}>
                        {rol}
                    </span>

                    <div style={{ width: '100%', height: '1px', background: '#F0F0F0' }} />

                    <div style={{ width: '100%' }}>
                        <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' as const }}>
                            Último acceso
                        </span>
                        <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#555', fontWeight: 500 as const, margin: 0 }}>
                            {ultimoAcceso}
                        </p>
                    </div>

                    <div style={{ width: '100%' }}>
                        <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' as const }}>
                            Miembro desde
                        </span>
                        <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#555', fontWeight: 500 as const, margin: 0 }}>
                            {new Date(perfil.date_joined).toLocaleDateString('es-MX', { dateStyle: 'medium' })}
                        </p>
                    </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', color: '#1A1A1A', marginBottom: '1.5rem' }}>
                        Información Personal
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' as const }}>
                                Nombre(s)
                            </span>
                            {editMode ? (
                                <>
                                    <input
                                        className={`input ${formErrors.first_name ? 'is-danger' : ''}`}
                                        type="text"
                                        value={form.first_name}
                                        onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                                        style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' }}
                                    />
                                    {formErrors.first_name && (
                                        <p style={{ color: '#E53E6D', fontSize: '0.78rem', fontFamily: 'Poppins', marginTop: '0.25rem' }}>
                                            {formErrors.first_name}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p style={{ fontFamily: 'Poppins', fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 500 as const, margin: 0 }}>
                                    {perfil.first_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' as const }}>
                                Apellido(s)
                            </span>
                            {editMode ? (
                                <>
                                    <input
                                        className={`input ${formErrors.last_name ? 'is-danger' : ''}`}
                                        type="text"
                                        value={form.last_name}
                                        onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                                        style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' }}
                                    />
                                    {formErrors.last_name && (
                                        <p style={{ color: '#e53e6d', fontSize: '0.78rem', fontFamily: 'Poppins', marginTop: '0.25rem' }}>
                                            {formErrors.last_name}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p style={{ fontFamily: 'Poppins', fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 500 as const, margin: 0 }}>{perfil.last_name}</p>
                            )}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' as const }}>
                            Matrícula / Usuario
                        </span>
                        <p style={{ fontFamily: 'Poppins', fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 500 as const, margin: 0 }}>
                            {perfil.matricula ?? perfil.username}
                        </p>
                    </div>

                    {(perfil.cuatrimestre !== null || perfil.grupo_escolar) && (
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' as const }}>
                                Grupo escolar
                            </span>
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 500 as const, margin: 0 }}>
                                {perfil.grupo_escolar ?? '—'}
                                {perfil.cuatrimestre !== null && ` · ${perfil.cuatrimestre}° cuatrimestre, grupo ${perfil.grupo ?? '—'}`}
                            </p>
                        </div>
                    )}

                    {perfil.carrera && (
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' as const }}>
                                Carrera
                            </span>
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 500 as const, margin: 0 }}>
                                {perfil.carrera}
                            </p>
                        </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' as const }}>
                            Correo electrónico
                        </span>
                        {editMode ? (
                            <>
                                <input
                                    className={`input ${formErrors.email ? 'is-danger' : ''}`}
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                                    style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' }}
                                />
                                {formErrors.email && (
                                    <p style={{ color: '#e53e6d', fontSize: '0.78rem', fontFamily: 'var(--font-poppins)', marginTop: '0.25rem' }}>
                                        {formErrors.email}
                                    </p>
                                )}
                            </>
                        ) : (
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 500 as const, margin: 0 }}>
                                {perfil.email}
                            </p>
                        )}
                    </div>

                    {editMode && (
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' as const }}>
                                Nueva contraseña (dejar vacío para no cambiar)
                            </span>
                            <input
                                className="input"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                                placeholder="••••••••"
                                style={{ fontFamily: 'Poppins', fontSize: '0.875rem', borderRadius: '8px' }}
                            />
                        </div>
                    )}

                    {!editMode && (
                        <div>
                            <span style={{ fontFamily: 'Poppins', fontSize: '0.8rem', fontWeight: 600 as const, color: '#888', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: '0.35rem', display: 'block' as const }}>
                                Rol
                            </span>
                            <p style={{ fontFamily: 'Poppins', fontSize: '0.95rem', color: '#1a1a1a', fontWeight: 500 as const, margin: 0 }}>
                                {rol}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
