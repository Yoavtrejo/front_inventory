import type { MaterialStatus } from "@/features/inventario/types"

const STATUS_STYLES: Record<MaterialStatus, { background: string; color: string }> = {
    Disponible: { background: '#d1fa35', color: '#065f46' },
    Prestado: { background: '#fef3c7', color: '#92400e' },
    Mantenimiento: { background: '#fee2e2', color: '#991b1b' },
    Agotado: { background: '#f3f4f6', color: '#374151' },
};

export function StatusBadge({ status }:{ status: MaterialStatus }){
    const style = STATUS_STYLES[status] ?? STATUS_STYLES.Agotado;

    return (
        <span style={{ ...style, padding: '0.2rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}>
            {status}
        </span>
    );
}
