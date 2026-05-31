// src/pages/admin/AdminProductos.jsx
// CRUD completo de productos para el administrador.

import { useState, useEffect, useMemo } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import {
  getProductosAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../../services/adminService'

const CATEGORIAS = [
  'CPU','GPU','RAM','Motherboard','Almacenamiento',
  'Fuente','Gabinete','Refrigeración','Celular',
]

const FORM_VACIO = {
  nombre: '', marca: '', categoria: '', precio: '',
  precioNormal: '', descuento: '', imagen: '', descripcion: '',
}

function fmtCOP(n) {
  return n ? `$${Number(n).toLocaleString('es-CO')}` : '—'
}

export default function AdminProductos() {
  const [productos,  setProductos]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [busqueda,   setBusqueda]   = useState('')
  const [catFiltro,  setCatFiltro]  = useState('Todas')
  const [modal,      setModal]      = useState(false)   // false | 'crear' | 'editar'
  const [editando,   setEditando]   = useState(null)    // producto en edición
  const [form,       setForm]       = useState(FORM_VACIO)
  const [errores,    setErrores]    = useState({})
  const [guardando,  setGuardando]  = useState(false)
  const [confirmDel, setConfirmDel] = useState(null)    // id a eliminar

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    setLoading(true)
    try {
      const data = await getProductosAdmin()
      setProductos(data)
    } finally {
      setLoading(false)
    }
  }

  /* ── Filtrado ── */
  const productosFiltrados = useMemo(() => {
    let lista = productos
    if (catFiltro !== 'Todas') lista = lista.filter(p => p.categoria === catFiltro)
    const q = busqueda.trim().toLowerCase()
    if (q) lista = lista.filter(p =>
      p.nombre?.toLowerCase().includes(q) ||
      (p.marca ?? '').toLowerCase().includes(q)
    )
    return lista
  }, [productos, catFiltro, busqueda])

  /* ── Abrir modal ── */
  const abrirCrear = () => {
    setForm(FORM_VACIO)
    setErrores({})
    setEditando(null)
    setModal('crear')
  }

  const abrirEditar = (producto) => {
    setForm({
      nombre:       producto.nombre      ?? '',
      marca:        producto.marca       ?? '',
      categoria:    producto.categoria   ?? '',
      precio:       producto.precio      ?? '',
      precioNormal: producto.precioNormal ?? '',
      descuento:    producto.descuento   ?? '',
      imagen:       producto.imagen      ?? '',
      descripcion:  producto.descripcion ?? '',
    })
    setErrores({})
    setEditando(producto)
    setModal('editar')
  }

  const cerrarModal = () => {
    setModal(false)
    setEditando(null)
  }

  /* ── Validar ── */
  const validar = () => {
    const e = {}
    if (!form.nombre.trim())   e.nombre    = true
    if (!form.categoria)       e.categoria = true
    if (!form.precio || isNaN(Number(form.precio))) e.precio = true
    setErrores(e)
    return Object.keys(e).length === 0
  }

  /* ── Guardar ── */
  const handleGuardar = async () => {
    if (!validar()) return
    setGuardando(true)
    try {
      const datos = {
        ...form,
        precio:       Number(form.precio),
        precioNormal: form.precioNormal ? Number(form.precioNormal) : undefined,
        descuento:    form.descuento    ? Number(form.descuento)    : 0,
      }
      if (modal === 'crear') {
        const nuevo = await crearProducto(datos)
        setProductos(prev => [...prev, nuevo])
      } else {
        const actualizado = await actualizarProducto(editando.id, datos)
        setProductos(prev => prev.map(p => p.id === editando.id ? actualizado : p))
      }
      cerrarModal()
    } catch (e) {
      console.error(e)
    } finally {
      setGuardando(false)
    }
  }

  /* ── Eliminar ── */
  const handleEliminar = async (id) => {
    try {
      await eliminarProducto(id)
      setProductos(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setConfirmDel(null)
    }
  }

  const set = (campo, val) => {
    setForm(prev => ({ ...prev, [campo]: val }))
    setErrores(prev => ({ ...prev, [campo]: false }))
  }

  return (
    <AdminLayout title="Productos" breadcrumb="Catálogo / Productos">

      {/* ── TOOLBAR ── */}
      <div className="admin-prod-toolbar">
        <div className="admin-prod-search">
          <svg className="admin-prod-search__icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="admin-prod-search__input"
            placeholder="Buscar por nombre o marca..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <select
          className="admin-filter-select"
          value={catFiltro}
          onChange={e => setCatFiltro(e.target.value)}
        >
          <option value="Todas">Todas las categorías</option>
          {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <button className="admin-btn-new" onClick={abrirCrear}>
          + Nuevo producto
        </button>
      </div>

      {/* ── CONTEO ── */}
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: '.65rem',
        letterSpacing: '1.5px', color: 'var(--text-muted)',
        marginBottom: '1rem',
      }}>
        {productosFiltrados.length} productos encontrados
      </p>

      {/* ── TABLA ── */}
      {loading ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.8rem', color: 'var(--text-muted)' }}>
          Cargando productos...
        </p>
      ) : productosFiltrados.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">◈</div>
          <p className="admin-empty__text">Sin productos</p>
        </div>
      ) : (
        <div className="admin-prod-table-wrap">
          <table className="admin-prod-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Marca</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Descuento</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map(p => (
                <tr key={p.id}>
                  <td>
                    <img
                      className="admin-prod-table__img"
                      src={p.imagen} alt={p.nombre}
                      onError={e => { e.target.style.opacity = '.2' }}
                    />
                  </td>
                  <td><span className="admin-prod-table__name">{p.nombre}</span></td>
                  <td>{p.marca ?? '—'}</td>
                  <td>
                    <span className="admin-badge admin-badge--muted">{p.categoria}</span>
                  </td>
                  <td style={{ color: 'var(--accent)', fontWeight: 700 }}>
                    {fmtCOP(p.precio)}
                  </td>
                  <td>
                    {p.descuento > 0
                      ? <span className="admin-badge admin-badge--danger">−{p.descuento}%</span>
                      : <span className="muted">—</span>
                    }
                  </td>
                  <td>
                    <div className="admin-prod-table__actions">
                      <button className="admin-btn-edit" onClick={() => abrirEditar(p)}>
                        Editar
                      </button>
                      <button className="admin-btn-delete" onClick={() => setConfirmDel(p.id)}>
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

      {/* ── MODAL CREAR / EDITAR ── */}
      {modal && (
        <div className="admin-form-overlay" onClick={cerrarModal}>
          <div className="admin-form-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-form-header">
              <h2 className="admin-form-title">
                {modal === 'crear' ? 'Nuevo producto' : 'Editar producto'}
              </h2>
              <button className="admin-form-close" onClick={cerrarModal}>✕</button>
            </div>

            <div className="admin-form-body">
              <div className="admin-form-row">
                <div className="admin-field">
                  <label className="admin-field__label">Nombre *</label>
                  <input
                    className={`admin-field__input ${errores.nombre ? 'error' : ''}`}
                    placeholder="Ej: AMD Ryzen 5 5600X"
                    value={form.nombre}
                    onChange={e => set('nombre', e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-field__label">Marca</label>
                  <input
                    className="admin-field__input"
                    placeholder="Ej: AMD, Intel, Apple..."
                    value={form.marca}
                    onChange={e => set('marca', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label className="admin-field__label">Categoría *</label>
                  <select
                    className={`admin-field__select ${errores.categoria ? 'error' : ''}`}
                    value={form.categoria}
                    onChange={e => set('categoria', e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label className="admin-field__label">Precio (COP) *</label>
                  <input
                    className={`admin-field__input ${errores.precio ? 'error' : ''}`}
                    type="number" placeholder="Ej: 738000"
                    value={form.precio}
                    onChange={e => set('precio', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label className="admin-field__label">Precio normal (tachado)</label>
                  <input
                    className="admin-field__input"
                    type="number" placeholder="Precio antes del descuento"
                    value={form.precioNormal}
                    onChange={e => set('precioNormal', e.target.value)}
                  />
                </div>
                <div className="admin-field">
                  <label className="admin-field__label">Descuento (%)</label>
                  <input
                    className="admin-field__input"
                    type="number" min="0" max="99" placeholder="Ej: 15"
                    value={form.descuento}
                    onChange={e => set('descuento', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-field__label">URL de imagen</label>
                <input
                  className="admin-field__input"
                  placeholder="https://..."
                  value={form.imagen}
                  onChange={e => set('imagen', e.target.value)}
                />
              </div>

              <div className="admin-field">
                <label className="admin-field__label">Descripción</label>
                <textarea
                  className="admin-field__textarea"
                  placeholder="Descripción breve del producto..."
                  value={form.descripcion}
                  onChange={e => set('descripcion', e.target.value)}
                />
              </div>
            </div>

            <div className="admin-form-footer">
              <button className="admin-btn-cancel" onClick={cerrarModal}>Cancelar</button>
              <button
                className="admin-btn-save"
                onClick={handleGuardar}
                disabled={guardando}
              >
                {guardando ? 'Guardando...' : modal === 'crear' ? 'Crear producto' : 'Guardar cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRMAR ELIMINACIÓN ── */}
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
                Esta acción no se puede deshacer. ¿Eliminar este producto?
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