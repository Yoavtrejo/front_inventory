'use client';

import { useRouter } from "next/navigation";
import { IoSearch, IoPeople, IoChevronForward } from "react-icons/io5";
import { useGrupos } from "../useGrupos";

export function GruposDocente() {
    const { grupos, loading, search, setSearch } = useGrupos();
    const router = useRouter();

    return (
        <div>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily:'Poppins', fontWeight: 700, fontSize:'1.75rem', color:'#1A1A1A', marginBottom:'0.25rem' }}>
                    Gestión de Grupos
                </h1>
                <p style={{ fontFamily: 'Poppins', color:'#888', fontSize:'0.875rem' }}>
                    Administra los grupos asignados.
                </p>
            </div>

            <div className="control has-icons-left" style={{ marginBottom:'1.5rem', maxWidth:'400px' }}>
                <input 
                    className="input"
                    type="text"
                    placeholder="BUscar por nombre, materia..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ fontFamily:'Poppins', borderRadius:'12px' }}
                />
                <span className="icon is-left"><IoSearch color="#aaa"/></span>
            </div>

            {loading ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1rem' }}>
                    {Array.from({ length: 3 }).map((_,i) => (
                        <div key={i} style={{ height:'140px', borderRadius:'16px', background: '#f0f0f0' }} />
                    ))}
                </div>
            ) : grupos.length === 0 ? (
                <div style={{ textAlign: 'center', fontFamily: 'Poppins', color: '#aaa', padding:'3rem' }}>
                    No tienes grupos asignados.
                </div>
            ) : (
                <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fill. minmax(280px, 1fr))', gap:'1rem' }}>
                    {grupos.map((grupo) => (
                        <div 
                            key={grupo.id} 
                            onClick={() => router.push(`/docente/grupos/${grupo.id}`)} 
                            style={{ background:'#fff', borderRadius:'16px', padding:'1.5rem', boxShadow:'1 2px 8px rgba(0,0,0,0.06)', cursor:'pointer', border:'1px solid transport', transition:'all 0.2s', position:'relative'}}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.border = '1px solid #f97316';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.15';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.border = '1px solid transparent';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06';
                            }}
                        >
                            <div style={{ position:'absolute', top:'1.25rem', right:'1.25rem' }}>
                                <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg, #f97316, #e53e6d)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <IoChevronForward size={16} color="#ffff" />
                                </div>
                            </div>

                            <div style={{ fontFamily:'Poppins', fontWeight:700, fontSize:'1rem', color:'#1a1a1a', margin:0 }}>
                                <div style={{ width: 44, height:44, borderRadius:'12px', background: '#fff7ed', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <IoPeople size={22} color="#f97316" />
                                </div>
                                <div>
                                    <p style={{ fontFamily:'Poppins', fontWeight:600, fontSize:'1rem', color:'#1a1a1a', margin:0 }}>
                                        {grupo.name}
                                    </p>
                                    <p style={{ fontFamily:'Poppins', fontSize:'0.78rem', color:'#888', margin:0 }}>
                                        {grupo.term_name}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection:'column', gap:'0.35rem' }}>
                                <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'#555', margin:0 }}>
                                    <strong>Materia:</strong> {grupo.subject_name}
                                </p>
                                <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'#555', margin:0 }}>
                                    <strong>Alumnos:</strong> {grupo.students.length}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}