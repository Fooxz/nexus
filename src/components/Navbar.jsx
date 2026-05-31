import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const { totalItems } = useCart()
  const isAdmin = user?.rol === 'ROLE_ADMIN'

  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="nav__logo">
          NEXUS<span>.</span>
        </Link>

        <nav className="nav__links" aria-label="Navegación principal">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/comparador">Comparador</Link>
          <Link to="/pc-builder">PC Builder</Link>
        </nav>

        <div className="nav__actions">
          <Link to="/carrito" className="btn btn-ghost">
            Carrito ({totalItems})
          </Link>

          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="btn btn-solid">
                  Dashboard
                </Link>
              )}
              <span className="btn btn-ghost" style={{ pointerEvents: 'none' }}>
                {user?.nombre || user?.email || 'Usuario'}
              </span>
              <button className="btn btn-solid" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Ingresar</Link>
              <Link to="/register" className="btn btn-solid">Registrar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}