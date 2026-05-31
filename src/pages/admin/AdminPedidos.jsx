// src/pages/admin/AdminPedidos.jsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getPedidos } from '../../services/adminService'

function fmtCOP(n) { return `$${Number(n || 0).toLocaleString('es-CO')}` }
function fmtFecha(f) {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminPedidos() {
  const [pedidos,  setPedidos]  = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    getPedidos()
      .then(data => setPedidos(data.reverse()))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout title="Pedidos" breadcrumb="Gestión / Pedidos">
      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.8rem', color: 'var(--text-muted)' }}>
          Cargando pedidos...
        </p>
      ) : pedidos.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">◎</div>
          <p className="admin-empty__text">Sin pedidos registrados aún</p>
        </div>
      ) : (
        <div className="admin-prod-table-wrap">
          <table className="admin-prod-table">
            <thead>
              <tr>
                <th>Orden ID</th>
                <th>Comprador</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p, i) => (
                <tr key={p.pedidoId ?? i}>
                  <td style={{ color: 'var(--accent)', fontWeight: 700 }}>
                    {p.pedidoId ?? `PED-${i+1}`}
                  </td>
                  <td>{p.nombreComprador ?? p.usuario ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {fmtFecha(p.fecha ?? p.savedAt)}
                  </td>
                  <td style={{ color: 'var(--accent)', fontWeight: 700 }}>
                    {fmtCOP(p.total)}
                  </td>
                  <td>
                    <span className="admin-badge admin-badge--success">
                      {p.estado ?? 'CONFIRMADO'}
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