// src/components/admin/AdminLayout.jsx
// Layout base para todas las páginas del admin.
// Incluye sidebar de navegación + topbar.

import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../styles/Admin/admin.css'

const NAV_ITEMS = [
  {
    section: 'Principal',
    items: [
      { to: '/admin',          label: 'Dashboard',  icon: '▦' },
    ]
  },
  {
    section: 'Catálogo',
    items: [
      { to: '/admin/productos', label: 'Productos',  icon: '◈' },
    ]
  },
  {
    section: 'Gestión',
    items: [
      { to: '/admin/pedidos',  label: 'Pedidos',    icon: '◎' },
      { to: '/admin/usuarios', label: 'Usuarios',   icon: '◉' },
    ]
  },
]

export default function AdminLayout({ children, title, breadcrumb }) {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user?.nombre
    ? user.nombre.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD'

  return (
    <div className="admin-layout">

      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <p className="admin-sidebar__eyebrow">Panel de control</p>
          <p className="admin-sidebar__title">NEXUS<span style={{ color: 'var(--accent)' }}>.</span></p>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(group => (
            <div key={group.section}>
              <p className="admin-sidebar__section-label">{group.section}</p>
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    `admin-nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="admin-nav-item__icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">{initials}</div>
            <div className="admin-sidebar__user-info">
              <p className="admin-sidebar__user-name">{user?.nombre}</p>
              <p className="admin-sidebar__user-role">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              style={{
                background: 'none', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                fontSize: '1rem', padding: '.25rem',
                transition: 'color .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              ⎋
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            {breadcrumb && (
              <p className="admin-topbar__breadcrumb">
                Admin <span>/</span> {breadcrumb}
              </p>
            )}
            <h1 className="admin-topbar__title">{title}</h1>
          </div>
          <a
            href="/"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '.65rem',
              letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--text-muted)', textDecoration: 'none',
              transition: 'color .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            ← Ver tienda
          </a>
        </div>

        <div className="admin-content">
          {children}
        </div>
      </div>

    </div>
  )
}