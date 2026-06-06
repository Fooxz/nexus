// src/pages/Productos.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar             from '../components/Navbar'
import Footer             from '../components/Footer'
import ProductCard        from '../components/ProductCard'
import FeaturedCarousel   from '../components/FeaturedCarousel'
import { useCart }        from '../context/CartContext'
import '../styles/productos/productLayout.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const LABELS = {
  cpu:'CPU', gpu:'GPU', ram:'RAM', motherboard:'Motherboard',
  storage:'Almacenamiento', psu:'Fuente', case:'Gabinete', cooling:'Refrigeración',
}

function normalizePcPart(p) {
  const prod = p.producto ?? p
  const specs = {}
  if (p.socket)        specs['Socket']    = p.socket
  if (p.nucleos)       specs['Núcleos']   = `${p.nucleos}C/${p.hilos ?? ''}T`
  if (p.velocidad)     specs['Velocidad'] = p.velocidad
  if (p.tdp)           specs['TDP']       = `${p.tdp}W`
  if (p.vram)          specs['VRAM']      = p.vram
  if (p.potencia)      specs['Potencia']  = `${p.potencia}W`
  if (p.capacidad)     specs['Capacidad'] = p.capacidad
  if (p.capacidadRam)  specs['Capacidad'] = p.capacidadRam
  if (p.capacidadSto)  specs['Capacidad'] = p.capacidadSto
  if (p.tipo)          specs['Tipo']      = p.tipo
  if (p.tipoRam)       specs['Tipo']      = p.tipoRam
  if (p.tipoStorage)   specs['Tipo']      = p.tipoStorage
  if (p.velocidadLec)  specs['Lectura']   = p.velocidadLec
  if (p.velocidadRam)  specs['Velocidad'] = p.velocidadRam
  if (p.chipset)       specs['Chipset']   = p.chipset
  if (p.formatoRam)    specs['RAM']       = `${p.formatoRam} x${p.slotsRam ?? ''}`
  if (p.certificacion) specs['Cert.']     = p.certificacion
  if (p.modular !== undefined && p.modular !== null) specs['Modular'] = p.modular ? 'Sí' : 'No'
  if (p.formato)       specs['Formato']   = p.formato
  if (p.ventanas !== undefined && p.ventanas !== null) specs['Ventana'] = p.ventanas ? 'Sí' : 'No'
  if (p.tdpSoporte)    specs['TDP max']   = `${p.tdpSoporte}W`
  if (p.tipoCooler)    specs['Tipo']      = p.tipoCooler

  return {
    id:          prod.id ?? p.id,
    nombre:      prod.nombre,
    marca:       prod.marca,
    precio:      prod.precio,
    imagen:      prod.imagen,
    categoria:   LABELS[prod.categoria] ?? prod.categoria,
    precioNormal: undefined,
    descuento:   0,
    stock:       prod.stock ?? 0,
    specs,
    _raw:        p,
  }
}

function normalizeCelular(c) {
  const specs = {}
  if (c.pantalla)       specs['Pantalla'] = c.pantalla
  if (c.procesador)     specs['CPU']      = c.procesador
  if (c.ram)            specs['RAM']      = c.ram
  if (c.almacenamiento) specs['Storage']  = c.almacenamiento
  if (c.bateria)        specs['Batería']  = c.bateria
  const prod = c.producto ?? c
  return {
    id:          prod.id ?? c.id,
    nombre:      `${prod.marca} ${c.modelo}`,
    marca:       prod.marca,
    precio:      prod.precio,
    precioNormal: c.precioNormal,
    descuento:   c.descuento ?? 0,
    imagen:      prod.imagen,
    categoria:   'Celular',
    stock:       prod.stock ?? 0,
    specs,
    _raw:        c,
  }
}

const SORT_OPTIONS = [
  { value: 'default',     label: 'Relevancia' },
  { value: 'precio-asc',  label: 'Precio: menor → mayor' },
  { value: 'precio-desc', label: 'Precio: mayor → menor' },
  { value: 'nombre-asc',  label: 'Nombre A → Z' },
]

const CATEGORY_ALIASES = {
  Celulares: 'Celular', celulares: 'Celular', Celular: 'Celular', celular: 'Celular',
}

export default function Productos() {
  const navigate                   = useNavigate()
  const [searchParams]             = useSearchParams()
  const { agregar, estaEnCarrito } = useCart()

  const [todosLosProductos, setTodosLosProductos] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [busqueda,  setBusqueda]  = useState('')
  const [catActiva, setCatActiva] = useState('Todos')
  const [orden,     setOrden]     = useState('default')
  const [agregado,  setAgregado]  = useState(null)

  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true)

        const endpoints = [
          'celulares', 'cpus', 'gpus', 'rams',
          'motherboards', 'storages', 'psus', 'cases', 'coolings'
        ]

        const resultados = await Promise.all(
          endpoints.map(e => fetch(`${API_BASE}/${e}`).then(r => r.json()))
        )

        const [celulares, cpus, gpus, rams, motherboards, storages, psus, cases, coolings] = resultados

        const todos = [
          ...celulares.map(normalizeCelular),
          ...cpus.map(normalizePcPart),
          ...gpus.map(normalizePcPart),
          ...rams.map(normalizePcPart),
          ...motherboards.map(normalizePcPart),
          ...storages.map(normalizePcPart),
          ...psus.map(normalizePcPart),
          ...cases.map(normalizePcPart),
          ...coolings.map(normalizePcPart),
        ]

        setTodosLosProductos(todos)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  useEffect(() => {
    const requested = searchParams.get('cat')
    if (!requested || requested.toLowerCase() === 'todo') {
      setCatActiva('Todos')
      return
    }
    setCatActiva(CATEGORY_ALIASES[requested] ?? requested)
  }, [searchParams])

  const categorias = useMemo(() => {
    const unicas = [...new Set(todosLosProductos.map(p => p.categoria))]
    return ['Todos', ...unicas]
  }, [todosLosProductos])

  const productosFiltrados = useMemo(() => {
    let lista = todosLosProductos
    if (catActiva !== 'Todos') lista = lista.filter(p => p.categoria === catActiva)
    const q = busqueda.trim().toLowerCase()
    if (q) lista = lista.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      (p.marca ?? '').toLowerCase().includes(q) ||
      (p.categoria ?? '').toLowerCase().includes(q)
    )
    if (orden === 'precio-asc')  lista = [...lista].sort((a, b) => a.precio - b.precio)
    if (orden === 'precio-desc') lista = [...lista].sort((a, b) => b.precio - a.precio)
    if (orden === 'nombre-asc')  lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre))
    return lista
  }, [todosLosProductos, catActiva, busqueda, orden])

  const handleAgregarCarrito = (producto) => {
    agregar(producto)
    setAgregado(producto.id)
    setTimeout(() => setAgregado(null), 1500)
  }

  const handleVerDetalle = (producto) => {
    navigate(`/productos/${producto.id}`, { state: { producto } })
  }

  return (
    <>
      <Navbar />
      <main className="productos-page">

        <section className="productos-header">
          <div className="productos-header__bg-word" aria-hidden="true">STORE</div>
          <div className="container productos-header__inner">
            <p className="productos-header__eyebrow">Catálogo completo</p>
            <h1 className="productos-header__title">
              <span className="outline">Nuestros</span> <span className="accent">Productos</span>
            </h1>
            <div className="productos-header__meta">
              <span><span className="dot" />{loading ? '—' : todosLosProductos.length} referencias</span>
              <span><span className="dot" />{categorias.length - 1} categorías</span>
            </div>
          </div>
        </section>

        {!loading && <FeaturedCarousel productos={todosLosProductos} />}

        <div className="container">
          <div className="productos-toolbar">
            <div className="search-box">
              <svg className="search-box__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text" className="search-box__input"
                placeholder="Buscar producto..."
                value={busqueda} onChange={e => setBusqueda(e.target.value)}
              />
            </div>
            <div className="cat-tabs">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`cat-tab ${catActiva === cat ? 'active' : ''}`}
                  onClick={() => setCatActiva(cat)}
                >{cat}</button>
              ))}
            </div>
            <div className="toolbar-right">
              <span className="results-count"><span>{productosFiltrados.length}</span> resultados</span>
              <select className="sort-select" value={orden} onChange={e => setOrden(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="container productos-body">
          {error ? (
            <p style={{ color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '.8rem' }}>
              Error: {error}
            </p>
          ) : loading ? (
            <div className="productos-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="productos-grid">
              {productosFiltrados.length === 0 ? (
                <div className="productos-empty">
                  <div className="productos-empty__icon">◈</div>
                  <p className="productos-empty__title">Sin resultados</p>
                  <p className="productos-empty__desc">Prueba con otra búsqueda o categoría</p>
                </div>
              ) : (
                productosFiltrados.map(p => (
                  <ProductCard
                    key={p.id}
                    producto={p}
                    enCarrito={estaEnCarrito(p.id)}
                    agregadoFeedback={agregado === p.id}
                    onVerDetalle={handleVerDetalle}
                    onAgregarCarrito={handleAgregarCarrito}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function SkeletonCard() {
  return (
    <div className="prod-card" style={{ pointerEvents: 'none' }}>
      <div className="prod-card__img-wrap" style={{ background: 'var(--bg-elevated)' }}>
        <div style={{ width: '60%', height: '60%', background: 'var(--border)', borderRadius: 2 }} />
      </div>
      <div className="prod-card__body">
        <div style={{ height: 8,  width: '35%', background: 'var(--border)', borderRadius: 2, marginBottom: 8 }} />
        <div style={{ height: 14, width: '80%', background: 'var(--bg-elevated)', borderRadius: 2 }} />
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {[40,55,35].map(w => <div key={w} style={{ height: 18, width: w, background: 'var(--border)', borderRadius: 2 }} />)}
        </div>
      </div>
      <div className="prod-card__footer">
        <div style={{ height: 18, width: 70, background: 'var(--accent-dim)', borderRadius: 2 }} />
      </div>
    </div>
  )
}