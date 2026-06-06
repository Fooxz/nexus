// src/pages/admin/AdminPedidos.jsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { getPedidos, eliminarPedido } from '../../services/adminService'  // ← agregar eliminarPedido

function fmtCOP(n) { return `$${Number(n || 0).toLocaleString('es-CO')}` }
function fmtFecha(f) {
  if (!f) return '—'
  return new Date(f).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function AdminPedidos() {
  const [pedidos,  setPedidos]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [confirmDel, setConfirmDel] = useState(null)  // ← estado para confirmar eliminación

  useEffect(() => {
    cargarPedidos()
  }, [])

  async function cargarPedidos() {
    setLoading(true)
    try {
      const data = await getPedidos()
      setPedidos(data.reverse())
    } finally {
      setLoading(false)
    }
  }

  // ← Función para eliminar pedido
  const handleEliminar = async (id) => {
    try {
      await eliminarPedido(id)
      setPedidos(prev => prev.filter(p => p.pedidoId !== id && p.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setConfirmDel(null)
    }
  }

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
                <th style={{ textAlign: 'right' }}>Acciones</th>  {/* ← columna acciones */}
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
                  <td>
                    <div className="admin-prod-table__actions" style={{ justifyContent: 'flex-end' }}>
                      <button 
                        className="admin-btn-delete" 
                        onClick={() => setConfirmDel(p.pedidoId ?? p.id ?? i)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── MODAL CONFIRMAR ELIMINACIÓN (mismo estilo que productos) ── */}
      {confirmDel && (
        <div className="admin-form-overlay" onClick={() => setConfirmDel(null)}>
          <div
            className="admin-form-modal"
            style={{ maxWidth: 380 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="admin-form-header">
              <h2 className="admin-form-title">Confirmar eliminación</h2>
              <button className="admin-form-close" onClick={() => setConfirmDel(null)}>✕</button>
            </div>
            <div className="admin-form-body">
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '.78rem',
                color: 'var(--text-secondary)', lineHeight: 1.6,
              }}>
                Esta acción no se puede deshacer. ¿Eliminar este pedido permanentemente?
              </p>
            </div>
            <div className="admin-form-footer">
              <button className="admin-btn-cancel" onClick={() => setConfirmDel(null)}>
                Cancelar
              </button>
              <button
                onClick={() => handleEliminar(confirmDel)}
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '.68rem',
                  letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700,
                  padding: '.6rem 1.5rem', background: 'var(--danger)',
                  color: '#fff', border: 'none', borderRadius: '2px', cursor: 'pointer',
                }}
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}