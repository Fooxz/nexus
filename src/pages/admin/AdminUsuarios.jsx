// src/pages/admin/AdminUsuarios.jsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getUsuarios } from '../../services/adminService'

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    getUsuarios().then(setUsuarios).finally(() => setLoading(false))
  }, [])

  const filtrados = usuarios.filter(u =>
    !busqueda ||
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <AdminLayout title="Usuarios" breadcrumb="Gestión / Usuarios">

      <div className="admin-prod-toolbar">
        <div className="admin-prod-search">
          <svg className="admin-prod-search__icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="admin-prod-search__input"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '.65rem',
          letterSpacing: '1.5px', color: 'var(--text-muted)', marginLeft: 'auto',
        }}>
          {filtrados.length} usuarios
        </p>
      </div>

      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.8rem', color: 'var(--text-muted)' }}>
          Cargando usuarios...
        </p>
      ) : filtrados.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">◉</div>
          <p className="admin-empty__text">Sin usuarios registrados</p>
        </div>
      ) : (
        <div className="admin-prod-table-wrap">
          <table className="admin-prod-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u, i) => (
                <tr key={u.id ?? i}>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {String(u.id).slice(0, 12)}...
                  </td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{u.nombre}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td>
                    <span className={`admin-badge ${u.rol === 'ROLE_ADMIN' ? 'admin-badge--warning' : 'admin-badge--muted'}`}>
                      {u.rol === 'ROLE_ADMIN' ? 'Admin' : 'Usuario'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}