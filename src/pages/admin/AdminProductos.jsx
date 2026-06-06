// src/pages/admin/AdminProductos.jsx
// Orquesta el CRUD de productos y delega formulario/tabla a componentes.

import { useState, useEffect, useMemo } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import AdminProductosToolbar from '../../components/admin/productos/AdminProductosToolbar'
import AdminProductosTable from '../../components/admin/productos/AdminProductosTable'
import ProductoFormModal from '../../components/admin/productos/ProductoFormModal'
import ConfirmDeleteProductoModal from '../../components/admin/productos/ConfirmDeleteProductoModal'
import {
  getProductosAdmin,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../../services/adminService'
import {
  PRODUCT_FORM_EMPTY,
  buildProductPayload,
  createFormFromProduct,
  validateProductForm,
} from '../../utils/adminProductForm'

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [catFiltro, setCatFiltro] = useState('Todas')
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(PRODUCT_FORM_EMPTY)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [confirmDel, setConfirmDel] = useState(null)

  useEffect(() => {
    cargarProductos()
  }, [])

  async function cargarProductos() {
    setLoading(true)
    try {
      const data = await getProductosAdmin()
      setProductos(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }

  const productosFiltrados = useMemo(() => {
    let lista = productos
    if (catFiltro !== 'Todas') lista = lista.filter(p => p.categoria === catFiltro)

    const q = busqueda.trim().toLowerCase()
    if (q) {
      lista = lista.filter(p =>
        p.nombre?.toLowerCase().includes(q) ||
        (p.marca ?? '').toLowerCase().includes(q)
      )
    }
    return lista
  }, [productos, catFiltro, busqueda])

  const abrirCrear = () => {
    setForm(PRODUCT_FORM_EMPTY)
    setErrores({})
    setEditando(null)
    setModal('crear')
  }

  const abrirEditar = (producto) => {
    setForm(createFormFromProduct(producto))
    setErrores({})
    setEditando(producto)
    setModal('editar')
  }

  const cerrarModal = () => {
    setModal(false)
    setEditando(null)
  }

  const cambiarCampo = (campo, valor) => {
    setForm(prev => ({ ...prev, [campo]: valor }))
    setErrores(prev => ({ ...prev, [campo]: false }))
  }

  const cambiarCategoria = (categoria) => {
    setForm(prev => ({ ...prev, categoria, specs: {} }))
    setErrores(prev => ({ ...prev, categoria: false }))
  }

  const cambiarSpec = (campo, valor) => {
    setForm(prev => ({
      ...prev,
      specs: { ...(prev.specs ?? {}), [campo]: valor },
    }))
  }

  const guardarProducto = async () => {
    const nextErrores = validateProductForm(form)
    setErrores(nextErrores)
    if (Object.keys(nextErrores).length > 0) return

    setGuardando(true)
    try {
      const datos = buildProductPayload(form)
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

  const confirmarEliminar = async () => {
    try {
      await eliminarProducto(confirmDel)
      setProductos(prev => prev.filter(p => p.id !== confirmDel))
    } catch (e) {
      console.error(e)
    } finally {
      setConfirmDel(null)
    }
  }

  return (
    <AdminLayout title="Productos" breadcrumb="Catalogo / Productos">
      <AdminProductosToolbar
        busqueda={busqueda}
        catFiltro={catFiltro}
        onBusquedaChange={setBusqueda}
        onCategoriaChange={setCatFiltro}
        onNuevo={abrirCrear}
      />

      <p className="admin-prod-count">
        {productosFiltrados.length} productos encontrados
      </p>

      {loading ? (
        <p className="admin-prod-loading">Cargando productos...</p>
      ) : productosFiltrados.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty__icon">-</div>
          <p className="admin-empty__text">Sin productos</p>
        </div>
      ) : (
        <AdminProductosTable
          productos={productosFiltrados}
          onEditar={abrirEditar}
          onEliminar={setConfirmDel}
        />
      )}

      {modal && (
        <ProductoFormModal
          modo={modal}
          form={form}
          errores={errores}
          guardando={guardando}
          onChange={cambiarCampo}
          onCategoriaChange={cambiarCategoria}
          onSpecChange={cambiarSpec}
          onClose={cerrarModal}
          onGuardar={guardarProducto}
        />
      )}

      {confirmDel && (
        <ConfirmDeleteProductoModal
          onClose={() => setConfirmDel(null)}
          onConfirm={confirmarEliminar}
        />
      )}
    </AdminLayout>
  )
}
