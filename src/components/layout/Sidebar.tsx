export default function Sidebar() {
    return (
        <div className="sidebar">
            <h2>Sidebar</h2>
            <ul>
                <div><a href="#"><span className="icon-text"><i className="fas fa-home" aria-hidden="true"></i></span>Inicio</a></div>
                <div><a href="#"><span className="icon-text"><i className="fas fa-cubes" aria-hidden="true"></i></span>Inventario</a></div>
                <div><a href="#"><span className="icon-text"><i className="fas fa-users" aria-hidden="true"></i></span>Usuarios</a></div>
                <div><a href="#"><span className="icon-text"><i className="fas fa-cogs" aria-hidden="true"></i></span>Perfil</a></div>
                <div><a href="#"><span className="icon-text"><i className="fas fa-sign-out" aria-hidden="true"></i></span>Cerrar sesión</a></div>
                <div><a href="#"><span className="icon-text"><i className="fas fa-info-circle" aria-hidden="true"></i></span>Acerca de</a></div>
            </ul>
        </div>
    )
}