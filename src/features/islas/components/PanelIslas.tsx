import type { Isla } from "../types";

const ESTADO_COLORS: Record<string, {background: string; color:string; dot:string}> = {
    Disponible: { background:'#f0fdf4', color:'#065f46', dot:'#22c55e' },
    Reservada: { background:'#fffbeb', color:'#92400e', dot:'#f59e0b' }
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
          <div key={isla.id} style={{background:'#fff',border:`1px solid ${style.dot}33`,borderRadius:'12px',padding:'0.75rem 1rem',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 1px 4px rgba(0,0,0,0.04)',}}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: style.dot, flexShrink: 0 }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a' }}>
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