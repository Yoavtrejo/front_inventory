'use client';

import { IoSearch, IoAdd } from 'react-icons/io5';
import { usePrestamos }        from '../hooks/usePrestamos';
import { LoanCard }            from './LoanCard';
import type { LoanStatus }     from '../types';
import { useRouter } from 'next/navigation';
import { ROLE_BASE_PATH, type SessionRole } from '@/utils/session';

const FILTERS: Array<'Todos' | LoanStatus> = ['Todos', 'Pendiente', 'Autorizado', 'Finalizado'];

const FILTER_STYLES: Record<string, { background: string; color: string }> = {
    Todos:      { background: '#f0f0f0', color: '#555'    },
    Pendiente:  { background: '#fef3c7', color: '#92400e' },
    Autorizado: { background: '#d1fae5', color: '#065f46' },
    Finalizado: { background: '#ff84ac', color: '#992048' },
};

interface PrestamosProps {
    role?: SessionRole;
}

export function Prestamos({ role = 'Administrador' }: PrestamosProps) {
    const isAdmin = role === 'Administrador';
    const {
        loans, loading, error,
        search,  setSearch,
        filter,  setFilter,
        handleAuthorize,
        handleFinalize,
        handleDelete,
    } = usePrestamos();

    const router = useRouter();

    return (
        <div style={{ width: '100%' }}>
            <div className="prestamos-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap:'wrap', gap:'1rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.75rem', color: '#1a1a1a', marginBottom: '0.25rem' }}>
                        {isAdmin ? 'Gestión de préstamos' : 'Mis préstamos'}
                    </h1>
                    <p style={{ fontFamily: 'Poppins', color: '#888', fontSize: '0.875rem' }}>
                        {isAdmin ? 'Administra y autoriza todas las solicitudes de préstamo.' : 'Consulta el estado de tus solicitudes de material.'}
                    </p>
                </div>

                <button onClick={() => router.push(`${ROLE_BASE_PATH[role]}/prestamos/crear`)} style={{background:'linear-gradient(135deg, #f97316, #e53e6d)',color:'#fff',fontFamily:'Poppins',fontWeight:600,fontSize:'0.9rem',border:'none',borderRadius:'12px',padding:'0.65rem 1.25rem',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.5rem',justifyContent:'center', width:'100%', maxWidth:'220px'}}>
                    <IoAdd size={18} /> Crear Préstamo
                </button>
            </div>

            <div className="prestamos-toolbar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div className="control has-icons-left" style={{ maxWidth: '320px', flex: '1 1 220px', width: '100%' }}>
                    <input
                        className="input"
                        type="text"
                        placeholder="Buscar préstamo, nombre, etc."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ fontFamily: 'Poppins', borderRadius: '12px' }}
                    />
                    <span className="icon is-left"><IoSearch color="#aaa" /></span>
                </div>

                <div className="prestamos-filters" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {FILTERS.map((f) => (
                        <button key={f} onClick={() => setFilter(f)} style={{...FILTER_STYLES[f],border:filter === f ? '2px solid #f0f0f0' : '2px solid transparent',borderRadius:'20px',padding:'0.35rem 1rem',fontFamily:'Poppins',fontWeight:600,fontSize:'0.8rem', cursor:'pointer',}}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="notification is-danger is-light" style={{ fontFamily: 'Poppins' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {loading ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} style={{ height: '180px', borderRadius: '16px', background: '#f0f0f0' }} />
                )) : loans.map((loan) => (
                    <LoanCard key={loan.id} loan={loan} onDelete={handleDelete} {...(isAdmin ? { onAuthorize: handleAuthorize, onFinalize: handleFinalize } : {})}/>
                ))
                }
            </div>

            {!loading && loans.length === 0 && (
                <div style={{ textAlign: 'center', fontFamily: 'Poppins', color: '#aaa', padding: '3rem' }}>
                    No hay préstamos {filter !== 'Todos' ? `con estado "${filter}"` : 'registrados'}.
                </div>
            )}
        </div>
    );
}