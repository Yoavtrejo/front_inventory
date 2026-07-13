import type { MaterialStatus } from "@/features/inventario/types"

const STATUS_STYLES: Record<MaterialStatus, { background: string; color: string }> = {
    'Disponible':    { background: '#d1fae5', color: '#065f46' },
    'Stock bajo':    { background: '#fef3c7', color: '#92400e' },
    'Agotado':       { background: '#fee2e2', color: '#991b1b' },
    'No disponible': { background: '#f3f4f6', color: '#374151' },
    'Dañado':        { background: '#fce7f3', color: '#9d174d' },
    'En reparación': { background: '#ede9fe', color: '#5b21b6' },
    'En préstamo':   { background: '#dbeafe', color: '#1e40af' },
};
export function StatusBadge({ status }:{ status: MaterialStatus }){
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.Agotado;

    return (
        <span style={{ ...style, padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontFamily: 'Poppins', fontWeight: 600 }}>
            {status}
        </span>
    );
}
