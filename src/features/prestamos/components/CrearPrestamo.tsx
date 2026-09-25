'use client';

import { IoPersonOutline, IoHammerOutline, IoChevronBackOutline, IoChevronForward, IoNewspaperOutline} from "react-icons/io5";
import { useCrearPrestamo } from "../hooks/useCrearPrestamo";

export function CrearPrestamo(){
    const { userInfo, materials, loadingMaterials, selected, selectedList, page, setPage, totalPages, 
        fecha, hora, loading, error, toggleMaterial, setQuantity, handleSubmit, handleCancel
    } = useCrearPrestamo();

    return (
        <div>
            <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.75rem', color: '#1a1a1a', marginBottom:'0.25rem'}}>
                Crear Préstamo
            </h1>
            <p style={{ fontFamily: 'Poppins', color:'#888', fontSize:'0.875rem', marginBottom: '1.5rem'}}>
                Completa lo que se te pide para proceder con tu solicitud.
            </p>

            <div style={{ background:'#ffffff', borderRadius:'16px', padding:'1.25rem 1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'1.5rem' }}>
                <div style={{ width:52, height:52, borderRadius:'50%', background: 'linear-gradient(135deg, #f97316, #e53e6d', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <IoPersonOutline size={26} color="#ffffff" />
                </div>

                <div>
                    <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>
                        Información del solicitante.
                    </h2>
                    <div style={{ display: 'flex', gap:'2rem', flexWrap:'wrap' }}>
                        <span style={{ fontFamily: 'Poppins', fontSize:'0.875rem', color: '#555' }}>
                            <strong>Nombre:</strong> {userInfo.name}
                        </span>
                        <span style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: '#555' }}>
                            <strong>Matrícula:</strong> {userInfo.matricula ?? userInfo.username}
                        </span>
                        <span style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: '#555' }}>
                            <strong>Rol:</strong> {userInfo.role}
                        </span>
                        {userInfo.carrera && (
                            <span style={{ fontFamily: 'Poppins', fontSize: '0.875rem', color: '#555' }}>
                                <strong>Carrera:</strong> {userInfo.carrera}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 340px)', gap: '1.5rem', alignItems:'start' }}>

                <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap:'0.5rem' }}>
                        <IoHammerOutline size={18} color="#d81e5b"/> Materiales Disponibles
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns:'32px minmax(0, 1fr) 80px 90px', gap:'0.5rem', padding: '0.5rem 0.25rem', borderBottom: '1px solid #f0f0f0', fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.78rem', color: '#555', textTransform: 'uppercase'}}>
                        <span/>
                        <span>Nombre</span>
                        <span>Stock</span>
                        <span>Cantidad</span>
                    </div>

                    {loadingMaterials ? Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} style={{height:'44px', borderRadius: '8px', background: '#f0f0f0', margin: '0.4rem 0'}}/>
                    )): materials.map((material) => {
                        const isSelected = !!selected[material.id];
                        return (
                            <div key={material.id} style={{ display: 'grid', gridTemplateColumns: '32px minmax(0, 1fr) 80px 90px', gap: '0.5rem', padding: '0.6rem 0.25rem', borderBottom: '1px solid #f9f9f9', alignItems: 'center', background: isSelected ? '#fff7ed' : 'transparent', borderRadius: isSelected ? '8px' : '0' }}>
                                <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => toggleMaterial(material)}
                                    style={{ width: 16, height: 16, accentColor: '#e53e6d', cursor: 'pointer' }}
                                />

                                <span style={{ fontFamily:'Poppins', fontSize: '0.875rem', color: '#1a1a1a' }}>
                                    {material.name}
                                </span>

                                <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: '8px', padding: '0.2rem 0.5rem', fontFamily: 'Poppins', fontWeight: 700, fontSize:'0.85rem', textAlign: 'center' }}>
                                    {material.quantity}
                                </span>

                                <input 
                                    type="number" 
                                    min={1}
                                    max={material.quantity}
                                    value={isSelected ? selected[material.id].quantity : ''}
                                    disabled={!isSelected}
                                    onChange={(e) => setQuantity(material.id, Number(e.target.value))}
                                    style={{ width: '100%', border:'1px solid #e5e7eb', borderRadius:'6px', padding: '0.25rem 0.5rem', fontFamily: 'Poppins', fontSize: '0.875rem', background: isSelected ? '#fff' : '#f9f9f9', color: isSelected ? '#1a1a1a' : '#ccc' }}
                                />
                                </div>
                            );
                        })
                    }

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                style={{ fontFamily: 'Poppins', fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius:'6px', border: '1px solid #e5e7eb', background: page === 1 ? '#f9f9f9' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: '#555' }}
                            >
                                <IoChevronBackOutline/> Anterior
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                style={{ fontFamily: 'Poppins', fontSize: '0.8rem', padding: '0.25rem  0.75rem', borderRadius: '6px', border: '1px solid #e5e7eb', background: page === 1 ? '#f9f9f9' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: '#555' }}
                            >
                                <IoChevronForward/>Siguiente
                            </button>
                        </div>
                    )}
                </div>

                <div style={{ background: '#fff', borderRadius:'16px', padding: '1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', position:'sticky', top:'1rem' }}>
                    <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem', marginBottom:'1rem', display:'flex', alignItems:'center' , gap:'0.5rem'}}>
                        <IoNewspaperOutline/> Resumen del préstamo.
                    </h3>

                    <p style={{ fontFamily:'Poppins', fontSize: '0.85rem', color:'#555', marginBottom:'0.25rem' }}>
                        <strong>Fecha:</strong> {fecha}
                    </p>

                    <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color:'#555', marginBottom: '1rem'}}>
                        <strong>Hora:</strong> {hora}
                    </p>

                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.85rem', color: '#1a1a1a', marginBottom: '0.75rem'}}>
                        Materiales seleccionados:
                    </p>

                    {selectedList.length === 0 
                        ? <p style={{ fontFamily: 'Poppins', fontSize:'0.85rem', color:'#aaa' }}>Ningún material seleccionado </p>
                        : selectedList.map((item) =>(
                            <div key={item.material_id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                                <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.9rem', color:'#1a1a1a', minWidth: '20px'  }}>
                                    {item.quantity}
                                </span>
                                <span style={{ fontFamily: 'Poppins', fontSize:'0.875rem', color:'#555' }}>
                                    {item.name}
                                </span>
                            </div>
                        )) 
                    }

                    {error && (
                        <p className="help is-danger" style={{ fontFamily:'Poppins', marginTop:'0.75rem' }}>
                            {error}
                        </p>
                    )}

                    <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.5rem' }}>
                        <button 
                            onClick={handleCancel}
                            style={{ flex:1, fontFamily:'Poppins',fontWeight:500, padding:'0.6rem', borderRadius:'1px solid #e5e7eb', background:'#fff', cursor:'pointer', color:'#555' }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || selectedList.length === 0}
                            style={{ flex:1, background:'linear-gradient(135deg, #f97316, #e53e6d)', color: '#fff', fontFamily:'Poppins', fontWeight: 600, padding:'0.6rem', borderRadius:'10px', border:'none', cursor: loading || selectedList.length === 0 ? 'not-allowed' : 'pointer', opacity: loading || selectedList.length === 0 ? 0.75 : 1 }}
                        >
                            {loading ? 'Enviando...' : 'Enviar solicitud'}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )

}