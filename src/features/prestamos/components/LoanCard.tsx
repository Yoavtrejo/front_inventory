import { getLoanStatus } from "../utils/loanStatus";
import { LoanStatusBadge } from "./LoanStatusBadge";
import { IoTrash } from "react-icons/io5";
import type { MaterialLoan } from "../types";

export interface AdminLoanActions {
    onAuthorize: (id: number) => void;
    onFinalize: (id: number) => void;
    onReject: (id: number) => void;
    onDelete: (id: number) => void;
}

export interface RequesterLoanActions {
    onCancel: (id: number) => void;
}

interface LoanCardProps {
    loan: MaterialLoan;
    // El admin gestiona todas las solicitudes; docente y alumno solo cancelan las suyas
    actions: AdminLoanActions | RequesterLoanActions;
}

const ACTION_BUTTON = { border:'none', borderRadius:'8px', padding:'0.4rem 1rem', fontFamily:'Poppins', fontWeight:600, fontSize:'0.8rem' } as const;

function actionStyle(enabled: boolean, background: string, color: string) {
    return { ...ACTION_BUTTON, background: enabled ? background : '#f0f0f0', color: enabled ? color : '#aaa', cursor: enabled ? 'pointer' : 'not-allowed' };
}

export function LoanCard ({ loan, actions } : LoanCardProps){
    const status = getLoanStatus(loan);
    const isPending = status === 'Pendiente';
    const isAuth = status === 'Autorizado';
    const adminActions = 'onAuthorize' in actions ? actions : null;
    const requesterActions = 'onCancel' in actions ? actions : null;
    const requesterId = loan.requested_by?.matricula ?? loan.requested_by?.username;

    return (
        <div style={{background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'1.25rem 1.5rem', boxShadow:'var(--shadow)', marginBottom:'0.75rem'}}>

            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem'}}>
                <span style={{fontFamily:'Poppins', fontWeight:700, fontSize:'0.9rem', color:'#e53e6d', borderBottom:'2px solid #f97316', paddingBottom:'2px'}}>
                    ID Préstamo: {loan.id}
                </span>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem'}}>
                    <LoanStatusBadge loan={loan} />
                    {adminActions && (
                        <button onClick={() => adminActions.onDelete(loan.id)} title="Eliminar" style={{ background: 'none', border:'none', cursor:'pointer', padding:'4px'}}>
                            <IoTrash size={18} color="#e53e6d"/>
                        </button>
                    )}
                </div>
            </div>

            <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'var(--text-soft)', marginBottom:'0.35rem' }}>
                <strong>Solicitante:</strong> {loan.requested_by?.first_name ?? '-'} {loan.requested_by?.last_name ?? '-'}
            </p>
            <div style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'var(--text-soft)', marginBottom:'0.35rem' }}>
                <strong>Materiales:</strong>
                <ul style={{ margin:'0.25rem 0 0', paddingLeft:'1.1rem', listStyle:'disc' }}>
                    {loan.items.map((item) => (
                        <li key={item.id}>{item.quantity} × {item.material_name}</li>
                    ))}
                </ul>
            </div>
            {requesterId && (
                <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'var(--text-soft)', marginBottom:'0.35rem'}}>
                    <strong>Matrícula:</strong> {requesterId}
                    {loan.requested_by?.grupo_escolar && <> · {loan.requested_by.grupo_escolar}</>}
                    {loan.requested_by?.carrera && <> · {loan.requested_by.carrera}</>}
                </p>
            )}

            <p style={{ fontFamily:'Poppins', fontSize:'0.85rem', color:'var(--text-soft)', marginBottom:'1rem'}}>
                <strong>Fecha solicitud:</strong> {loan.loan_date}
            </p>

            {adminActions && (
                <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap'}}>
                    <button onClick={() => adminActions.onAuthorize(loan.id)} disabled={!isPending} style={actionStyle(isPending, '#d1fae5', '#065f46')}>
                        Autorizar
                    </button>
                    <button onClick={() => adminActions.onFinalize(loan.id)} disabled={!isAuth} style={actionStyle(isAuth, '#fce7f3', '#9d174d')}>
                        Finalizar
                    </button>
                    <button onClick={() => adminActions.onReject(loan.id)} disabled={!isPending} style={actionStyle(isPending, '#f8d7da', '#721c24')}>
                        Rechazar
                    </button>
                </div>
            )}

            {requesterActions && isPending && (
                <button onClick={() => requesterActions.onCancel(loan.id)} style={actionStyle(true, '#e2e3e5', '#383d41')}>
                    Cancelar solicitud
                </button>
            )}
        </div>
    )
}
