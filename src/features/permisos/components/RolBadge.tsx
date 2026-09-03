import { getRolUsuario } from '../types';
import type { Usuario } from '../types';

const ROL_STYLES = {
    Administrador: { background: '#fef3c7', color: '#92400e' },
    Docente: { background: '#d1fae5', color: '#065f46' },
    Alumno: { background: '#dbeafe', color: '#1e40af'},
};

export function RolBadge({ usuario } : { usuario: Usuario }) {
    const rol = getRolUsuario(usuario);
    const style = ROL_STYLES[rol] || { background: '#e5e7eb', color: '#374151' };

    return (
        <span style={{ ...style, fontFamily:'Poppins', fontSize:'0.78rem', fontWeight: 600, borderRadius:'20px', padding:'0.2rem 0.5rem'}}>
            {rol}
        </span>
    );

}