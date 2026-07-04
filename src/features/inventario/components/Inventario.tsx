'use client';

import { IoPencil, IoTrash, IoSearch, IoAdd } from "react-icons/io5";
import { useInventario } from "../hooks/useInventario";
import { useInventarioModal } from "../hooks/useInventarioModal";
import { MaterialModal } from "./MaterialModal";
import { StatusBadge } from "./StatusBadge";

export function Inventario(){
    const { materials, loading, error, search, setSearch, refetch, handleDelete } = useInventario();
    const { mode, form, setForm, loading: saving, error: saveError, formErrors, openCreate, openEdit, close, handleSubmit } = useInventarioModal(refetch);

    return(
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
                <div>
                    <h1 style={{ fontWeight: 700, fontSize: '1.75rem', color: '#1a1a1a', marginBottom:'0.25rem'}}> Gestión de Inventario </h1>
                    <p style={{ color:'#888', fontSize:'0.875rem'}}> Administra todo el material que está dentro del laboratorio.</p>
                </div>

                <button onClick={openCreate} style={{ background: 'linear-gradient(135deg, #f97316, #e53e6d)', color: '#fff', fontWeight:600, fontSize:'0.9rem', border:'none', borderRadius:'12px', padding:'0.65rem 1.25rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <IoAdd size={18} />
                    Agregar material
                </button>
            </div>

            <div className="control has-icons-left" style={{ marginBottom:'1.25rem', maxWidth: '400px'}}>
                <input className="input" type="text" placeholder="Buscar material, tipo, etc" value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderRadius: '12px' }}/>
                <span className="icon is-left">
                    <IoSearch color="#aaa"/>
                </span>
            </div>

            {error && (
                <div className="notification is-danger is-light">{error}</div>
            )}

            <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 2fr 100px 120px 110px', padding: '0.75rem 1.5rem', borderBottom: '2px solid', borderImage: 'linear-gradient(135deg, #f97316, #e53e6d) 1', fontWeight: 700, fontSize:'0.8rem', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing:'0.05rem'}}>
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
                    <div key={material.id} style={{ display:'grid', gridTemplateColumns: '80px 1fr 2fr 100px 120px 110px', padding: '1rem 1.5rem', alignItems:'center', background: index % 2 === 0 ? '#ffffff' : '#fafafa', borderBottom:'1px solid #f5f5f5', fontSize: '0.875rem'}}>
                        <span style={{ color:'#888', fontWeight: 500 }}>{String(material.id).padStart(3, '0')}</span>
                        <span style={{ fontWeight: 500, color: '#1a1a1a'}}>{material.name}</span>
                        <span style={{ color: '#666666'}}>{material.description}</span>
                        <span style={{ fontWeight:600, color: '#1a1a1a'}}>{material.quantity}</span>
                        <StatusBadge status={material.status}/>
                        <div style={{ display:'flex', gap:'0.5rem '}}>
                            <button onClick={() => openEdit(material)} style={{background: 'none', border:'none', cursor: 'pointer', padding: '4px'}} title="Editar">
                                <IoPencil size={18} color="#f97316"/>
                            </button>
                            <button onClick={() => handleDelete(material.id)} style={{ background:'none', border:'none', cursor: 'pointer', padding:'4px'}} title="Eliminar">
                                <IoTrash size={18} color="#e53e6d"/>
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