import type { Isla } from "../types";

const ESTADO_COLORS: Record<string, {background: string; color:string; dot:string}> = {
  Disponible: { background:'var(--isla-available-bg)', color:'var(--isla-available-text)', dot:'#22c55e' },
  Reservada: { background:'var(--isla-reserved-bg)', color:'var(--isla-reserved-text)', dot:'#f59e0b' }
};

interface PanelIslasProps {
    islas: Isla[];
    onDelete: (id:number) => void;
    isAdmin: boolean;
}

export function PanelIslas({ islas, onDelete, isAdmin} : PanelIslasProps) {
    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {islas.map((isla) => {
        const style = ESTADO_COLORS[isla.estado] ?? ESTADO_COLORS.Disponible;
        return (
          <div key={isla.id} style={{background:'var(--surface)',border:`1px solid ${style.dot}33`,borderRadius:'12px',padding:'0.75rem 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'var(--shadow)',}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: style.dot, flexShrink: 0 }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>
                Isla #{isla.numero_isla}
              </span>
            </div>
            <span style={{fontFamily:'Poppins',fontSize:'0.75rem',fontWeight:600,color:style.color,background:style.background,borderRadius:'20px',padding:'0.2rem 0.6rem',}}>
              {isla.estado}
            </span>
          </div>
        );
      })}
    </div>
  );
}