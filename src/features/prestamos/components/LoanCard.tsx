import { getLoanStatus } from "../utils/loanStatus";
import { LoanStatusBadge } from "./LoanStatusBadge";
import { IoTrash } from "react-icons/io5";
import type { MaterialLoan } from "../types";

interface LoanCardProps {
    loan: MaterialLoan;
    // Sin estas acciones la tarjeta es de solo consulta (docente/alumno)
    onAuthorize?: (id: number) => void;
    onFinalize?: (id: number) => void;
    onDelete: (id: number) => void;
}

export function LoanCard ({ loan, onAuthorize, onFinalize, onDelete} : LoanCardProps){
    const status = getLoanStatus(loan);
    const isPending = status === 'Pendiente';
    const isAuth = status === 'Autorizado';
    const canManage = Boolean(onAuthorize && onFinalize);
    const canDelete = canManage || isPending;

    return (
        <div style={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'1.25rem 1.5rem', boxShadow:'var(--shadow)', marginBottom:'0.75rem'}}>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem'}}>
                <span style={{fontFamily:'Poppins', fontWeight:700, fontSize:'0.9rem', color:'#e53e6d', borderBottom:'2px solid #f97316', paddingBottom:'2px'}}>
                    ID Préstamo: {loan.id}
                </span>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <LoanStatusBadge loan={loan} />
                    {canDelete && (
                        <button onClick={() => onDelete(loan.id)} title={canManage ? 'Eliminar' : 'Cancelar solicitud'} style={{ background: 'none', border:'none', cursor:'pointer', padding:'4px'}}>
                            <IoTrash size={18} color="#e53e6d"/>
                        </button>
                    )}
                </div>
            </div>

            <p style={{fontFamily:'Poppins', fontSize:'0.85rem', color:'var(--text-soft)', marginBottom:'0.35rem'}}>
                <strong>Material ID:</strong> {loan.material}
            </p>
            <div style={{display:'flex', gap:'2rem', marginBottom:'0.35rem'}}>
                <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'var(--text-soft)' }}>
                    <strong>Solicitante:</strong> {loan.requested_by?.first_name ?? '-'} {loan.requested_by?.last_name ?? '-'}
                </p>
                <p style={{ fontFamily: 'Poppins', fontSize:'0.85rem', color:'var(--text-soft)' }}>
                    <strong>Cantidad:</strong> {loan.quantity}
                </p>
            </div>

            <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'var(--text-soft)', marginBottom:'1rem'}}>
                <strong>Fecha solicitud:</strong> {loan.loan_date}
            </p>

            {canManage && (
            <div style={{ display:'flex', gap:'0.5rem'}}>
                <button 
                    onClick={() => onAuthorize?.(loan.id)} 
                    disabled={!isPending}
                    style={{background: isPending ? '#d1fae5' : '#f0f0f0', color: isPending ? '#065f46' : '#aaa', border:'none', borderRadius:'8px', padding:'0.4rem 1rem', fontFamily:'Poppins', fontWeight:600, fontSize:'0.8rem', cursor: isPending ? 'pointer' : 'not-allowed'}}
                > 
                    Autorizar
                </button>
                <button
                    onClick={() => onFinalize?.(loan.id)}
                    disabled={!isAuth}
                    style={{ background: isAuth ? '#fce7f3' : '#f0f0f0', color: isAuth ? '#9d174d' : '#aaa', border:'none', borderRadius:'0.8rem', padding:'0.4rem 1rem', fontFamily:'Poppins', fontSize:'0.8rem', fontWeight: 600, cursor: isAuth ? 'pointer' : 'not-allowed'}}
                >
                    Finalizar
                </button>
            </div>
            )}
        </div>
    )
}