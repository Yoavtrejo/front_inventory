'use client';

import { IoPencil, IoTrash, IoSearch, IoAdd } from "react-icons/io5";
import { useInventario } from "../hooks/useInventario";
import { useInventarioModal } from "../hooks/useInventarioModal";
import { MaterialModal } from "./MaterialModal";
import { StatusBadge } from "./StatusBadge";
import { ConfirmModal } from "@/components/ui/Modal/ConfirmModal";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function Inventario(){
    const { materials, loading, error, search, setSearch, refetch, handleDelete } = useInventario();
    const { mode, form, setForm, loading: saving, error: saveError, formErrors, openCreate, openEdit, close, handleSubmit } = useInventarioModal(refetch);
    const [ confirmDlete, setConfirmDelete] = useState<number | null>(null);

    return(
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems:'flex-start', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
                <div>
                    <h1 style={{ fontWeight: 700, fontSize: 'clamp(1.25rem, 2vw, 1.75rem)', color: 'var(--text)', marginBottom:'0.25rem'}}> Gestión de Inventario </h1>
                    <p style={{ color:'var(--text-muted)', fontSize:'0.875rem'}}> Administra todo el material que está dentro del laboratorio.</p>
                </div>

                <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #f97316, #e53e6d)', color: '#fff', fontWeight:600, fontSize:'0.9rem', border:'none', borderRadius:'12px', padding:'0.65rem 1.25rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem', width:'100%', maxWidth:'220px', justifyContent:'center'}}>
                    <IoAdd size={18} />
                    Agregar material
                </button>
            </div>

            <div className="control has-icons-left" style={{ marginBottom:'1.25rem', maxWidth: '400px', width:'100%'}}>
                <input className="input" type="text" placeholder="Buscar material, tipo, etc" value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderRadius: '12px' }}/>
                <span className="icon is-left">
                    <IoSearch color="#aaa"/>
                </span>
            </div>

            {error && (
                <div className="notification is-danger is-light">{error}</div>
            )}

            <div style={{ background: 'var(--surface)', border:'1px solid var(--border)', borderRadius: '16px', overflowX: 'auto', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 2fr 100px 120px 110px', minWidth: '760px', padding: '0.75rem 1.5rem', borderBottom: '2px solid', borderImage: 'linear-gradient(135deg, #f97316, #e53e6d) 1', fontWeight: 700, fontSize:'0.8rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing:'0.05rem'}}>
                    <span>ID</span>
                    <span>Nombre</span>
                    <span>Descripción</span>
                    <span>Stock</span>
                    <span>Estado</span>
                    <span>Acciones</span>
                </div>

                {loading && (
                    <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection:'column', gap:'0.75rem'}}>
                        {Array.from({ length: 5}).map((_, i)=>(
                            <div key={i} style={{ height:'48px', borderRadius:'8px', background:'#f0f0f0'}}/>
                        ))}
                    </div>
                )}

                {!loading && materials.map((material, index) => (
                    <div key={material.id} style={{ display:'grid', gridTemplateColumns: '80px 1fr 2fr 100px 120px 110px', minWidth: '760px', padding: '1rem 1.5rem', alignItems:'center', background: index % 2 === 0 ? 'var(--surface)' : 'var(--surface-soft)', borderBottom:'1px solid var(--border)', fontSize: '0.875rem'}}>
                        <span style={{ color:'var(--text-muted)', fontWeight: 500 }}>{String(material.id).padStart(3, '0')}</span>
                        <span style={{ fontWeight: 500, color: 'var(--text)'}}>{material.name}</span>
                        <span style={{ color: 'var(--text-soft)'}}>{material.description}</span>
                        <span style={{ fontWeight:600, color: 'var(--text)'}}>{material.quantity}</span>
                        <StatusBadge status={material.status}/>
                        <div style={{ display:'flex', gap:'0.5rem '}}>
                            <button onClick={() => openEdit(material)} style={{background: 'none', border:'none', cursor: 'pointer', padding: '4px'}} title="Editar">
                                <IoPencil size={18} color="#f97316"/>
                            </button>
                            <ConfirmModal
                                open={confirmDlete !== null}
                                title="Eliminar material"
                                message="¿Estás seguro de que deseas eliminar este material? Esta acción no se puede deshacer."
                                onClose={() => setConfirmDelete(null)}
                                onConfirm={async() => {
                                    if (confirmDlete !== null){
                                        await handleDelete(confirmDlete);
                                        setConfirmDelete(null);
                                    }
                                }}
                                confirmLabel="Sí, eliminar"
                            />
                            <button
                                onClick={() => setConfirmDelete(material.id)}
                                style={{ background:'none', border:'none', cursor:'pointer', padding:'4px' }}
                            >
                                <IoTrash color="#e53e6d"/>
                            </button>
                        </div>
                    </div>
                ))}

                {!loading && materials.length === 0 && (
                    <div style={{ padding:'3rem', textAlign:'center', color:'#aaa'}}>No hay materiales registrados.</div>
                )}
            </div>

            {mode && (
                <MaterialModal
                mode={mode}
                form={form}
                setForm={setForm}
                loading={saving}
                error={saveError}
                formErrors={formErrors}
                onClose={close}
                onSubmit={handleSubmit}
                />
            )}
        </div>
    )
}