import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { pathname }              = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate                  = useNavigate()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('nexus_cart') || '[]')
      setCartCount(cart.length)
    } catch { setCartCount(0) }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const links = [
    { to: '/',           label: 'Inicio' },
    { to: '/productos',  label: 'Productos' },
    { to: '/pc-builder', label: 'PC Builder' },
    { to: '/comparador', label: 'Comparar' },
  ]

  return (
    <header>
      <nav className="nav">
        <div className="nav__inner">
          <Link className="nav__logo" to="/">NEXUS<span>.</span></Link>

          <ul className="nav__links">
            {links.map(l => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  style={{ color: pathname === l.to ? 'var(--accent)' : undefined }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav__actions">
            {isAuthenticated ? (
              <>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '.72rem',
                  letterSpacing: '2px', textTransform: 'uppercase',
                  color: 'var(--accent)'
                }}>
                  {user?.nombre}
                </span>
                <button
                  className="btn-ghost"
                  onClick={handleLogout}
                  style={{cursor:'pointer', background:'none'}}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link className="btn-ghost" to="/login">Ingresar</Link>
                <Link className="btn-solid" to="/register">Crear cuenta</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}