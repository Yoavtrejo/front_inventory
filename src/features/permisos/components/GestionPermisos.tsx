'use client';

import { useState } from "react";
import { IoSearch, IoAdd, IoPencil, IoTrash } from "react-icons/io5";
import { usePermisos } from "../hooks/usePermisos";
import { useUsuarioModal } from "../hooks/useUsuarioModal";
import { RolBadge } from "./RolBadge";
import { UsuarioModal } from "./UsuarioModal";
import { ConfirmModal } from "@/components/ui/Modal/ConfirmModal";

export function GestionPermisos() {
    const { usuarios, loading, search, setSearch, refetch, handleDelete } = usePermisos();
    const { open, form,setForm, formErrors, loading: saving, isEdit, openCreate, openEdit, close, handleSubmit } = useUsuarioModal(refetch);
    const [ confitmDelete, setConfirmDelete] = useState<number | null>(null);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
                <div>
                    <h1 style={{ fontFamily:'Poppins', fontWeight:'700', fontSize:'1.75rem', color:'#1A1A1A', marginBottom:'0.25rem' }}>
                        Gestión de Permisos
                    </h1>
                    <p style={{ fontFamily:'Poppins', color:'#888', fontSize:'0.875rem' }}>
                        Administra el acceso que cada usuario tiene en el sistema.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    style={{ background:'linear-gradient(135deg, #F97316, #E53E6D)', color:'#FFF', fontFamily:'Poppins', fontSize:'0.9rem', border:'none', borderRadius:'12px', padding:'0.65rem 1.25rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem' }}
                >
                    <IoAdd size={18} /> Agregar usuario
                </button>
            </div>

            <div className="control has-icons-left" style={{ marginBottom:'1.25rem', maxWidth:'400px' }}>
                <input 
                    className="input"
                    type="text"
                    placeholder="Buscar por nombre, correo, etc."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ fontFamily:'Poppins', borderRadius:'12px'}}
                />
                <span className="icon is-left"><IoSearch color="#AAA"/></span>
            </div>

            <div style={{ background:'#FFF', borderRadius:'16px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>

                <div style={{ display:'grid', gridTemplateColumns:'60px 1fr 1fr 1fr 120px 100px', padding:'0.75rem 1.5rem', borderBottom:'2px solid', borderImage:'linear-gradient(135deg, #F97316, #E53E6D) 1', fontFamily:'Poppins', fontWeight:'700', fontSize:'0.8rem', color:'#1A1A1A', textTransform:'uppercase', letterSpacing:'0.05rem' }}>
                    <span>ID</span>
                    <span>Nombre</span>
                    <span>Correo</span>
                    <span>Usuario</span>
                    <span>Rol</span>
                    <span>Acciones</span>
                </div>

                {loading && (
                    <div style={{ padding:'1rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                        {Array.from({ length: 5 }).map((_,i) => (
                            <div key={i} style={{ height:'48px', borderRadius:'8px', background:'#F0F0F0' }}/>
                        ))}
                    </div>
                )}

                {!loading && usuarios.map((usuario, index) => (
                    <div key={usuario.id} style={{ display:'grid', gridTemplateColumns:'60px 1fr 1fr 1fr 120px 100px', padding:'1rem 1.5rem', alignItems:'center', background: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA', borderBottom:'1px solid #F5F5F5', fontFamily:'Poppins', fontSize:'0.875rem' }}>
                        <span style={{ color:'#888', fontWeight:500}}>
                            {String(usuario.id).padStart(3,'0')}
                        </span>
                        <span style={{ fontWeight:500, color:'#1A1A1A' }}>
                            {usuario.first_name} {usuario.last_name}
                        </span>
                        <span style={{ color:'#666' }}>
                            {usuario.email}
                        </span>
                        <span style={{ color: '#666' }}>
                            {usuario.username}
                        </span>
                        <RolBadge usuario={usuario} />

                        <div style={{ display:'flex', gap:'0.5rem' }}>
                            <button 
                                onClick={() => openEdit(usuario)}
                                style={{ background: 'none', border:'none', cursor:'pointer', padding:'4px'}}
                                title="Editar"
                            >
                                <IoPencil size={18} color="#F97316"/>
                            </button>
                            <button
                                onClick={() => setConfirmDelete(usuario.id)}
                                style={{ background:'none', border:'none', cursor:'pointer', padding:'4px' }}
                                title="Eliminar"
                            >
                                <IoTrash size={18} color="#E53E6D"/>
                            </button>
                        </div>
                    </div>
                ))}

                {!loading && usuarios.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'var(--font-poppins)', color: '#aaa' }}>
                        No hay usuarios registrados.
                    </div>
                )}
            </div>

            {open && (
                <UsuarioModal
                    isEdit={isEdit}
                    form={form}
                    setForm={setForm}
                    formErrors={formErrors}
                    loading={saving}
                    onClose={close}
                    onSubmit={handleSubmit}
                />
            )}

            <ConfirmModal
                open={confitmDelete !== null}
                title="Eliminar usuario"
                message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
                confirmLabel="Sí, eliminar"
                onClose={() => setConfirmDelete(null)}
                onConfirm={async () => {
                    if (confitmDelete !== null) {
                        await handleDelete(confitmDelete);
                        setConfirmDelete(null);
                    }
                }}
            />
        </div>
    )
}