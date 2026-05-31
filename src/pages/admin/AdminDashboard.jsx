// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/admin/AdminLayout'
import { getStats, getPedidos, getUsuarios } from '../../services/adminService'

function fmtCOP(n) {
  return `$${Number(n || 0).toLocaleString('es-CO')}`
}

export default function AdminDashboard() {
  const [stats,    setStats]    = useState(null)
  const [pedidos,  setPedidos]  = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function cargar() {
      try {
        const [s, p, u] = await Promise.all([getStats(), getPedidos(), getUsuarios()])
        setStats(s)
        setPedidos(p.slice(-8).reverse()) // últimos 8
        setUsuarios(u.slice(0, 6))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  if (loading) return (
    <AdminLayout title="Dashboard">
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.8rem', color: 'var(--text-muted)' }}>
        Cargando...
      </p>
    </AdminLayout>
  )

  return (
    <AdminLayout title="Dashboard" breadcrumb="Inicio">

      {/* ── STATS ── */}
      <div className="admin-stats-grid">
        <StatCard label="Productos"     value={stats?.totalProductos ?? 0} icon="◈" accent />
        <StatCard label="Pedidos total" value={stats?.totalPedidos   ?? 0} icon="◎" />
        <StatCard label="Usuarios"      value={stats?.totalUsuarios  ?? 0} icon="◉" />
        <StatCard
          label="Ingresos simulados"
          value={fmtCOP(stats?.ingresos)}
          icon="$" accent
          sub="Total acumulado"
        />
      </div>

      <div className="admin-two-cols">

        {/* ── ÚLTIMOS PEDIDOS ── */}
        <div>
          <div className="admin-section-title">
            Últimos pedidos
            <Link to="/admin/pedidos">Ver todos →</Link>
          </div>
          {pedidos.length === 0 ? (
            <EmptyState text="Sin pedidos aún" />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Usuario</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p, i) => (
                  <tr key={p.pedidoId ?? i}>
                    <td className="accent">{p.pedidoId ?? `PED-${i+1}`}</td>
                    <td>{p.nombreComprador ?? p.usuario ?? '—'}</td>
                    <td className="accent">{fmtCOP(p.total)}</td>
                    <td>
                      <span className="admin-badge admin-badge--success">
                        {p.estado ?? 'CONFIRMADO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── USUARIOS REGISTRADOS ── */}
        <div>
          <div className="admin-section-title">
            Usuarios registrados
            <Link to="/admin/usuarios">Ver todos →</Link>
          </div>
          {usuarios.length === 0 ? (
            <EmptyState text="Sin usuarios aún" />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, i) => (
                  <tr key={u.id ?? i}>
                    <td>{u.nombre}</td>
                    <td className="muted">{u.email}</td>
                    <td>
                      <span className={`admin-badge ${u.rol === 'ROLE_ADMIN' ? 'admin-badge--warning' : 'admin-badge--muted'}`}>
                        {u.rol === 'ROLE_ADMIN' ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* ── CATEGORÍAS ── */}
      {stats?.categorias?.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div className="admin-section-title">Productos por categoría</div>
          <table className="admin-table">
            <thead>
              <tr><th>Categoría</th><th>Total productos</th></tr>
            </thead>
            <tbody>
              {stats.categorias.map(c => (
                <tr key={c.nombre}>
                  <td>{c.nombre}</td>
                  <td className="accent">{c.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </AdminLayout>
  )
}

function StatCard({ label, value, icon, accent, sub }) {
  return (
    <div className="stats-card">
      <p className="stats-card__label">{label}</p>
      <p className={`stats-card__value ${accent ? 'accent' : ''}`}>{value}</p>
      {sub && <p className="stats-card__sub">{sub}</p>}
      <span className="stats-card__icon" aria-hidden="true">{icon}</span>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div className="admin-empty">
      <div className="admin-empty__icon">◈</div>
      <p className="admin-empty__text">{text}</p>
    </div>
  )
}