// src/pages/Productos.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar             from '../components/Navbar'
import Footer             from '../components/Footer'
import ProductCard        from '../components/ProductCard'
import FeaturedCarousel   from '../components/FeaturedCarousel'
import { useCart }        from '../context/CartContext'
import { CELULARES }      from '../data/mockCelulares'
import '../styles/productos/productLayout.css'

const LABELS = {
  cpu:'CPU', gpu:'GPU', ram:'RAM', motherboard:'Motherboard',
  storage:'Almacenamiento', psu:'Fuente', case:'Gabinete', cooling:'Refrigeración',
}

function normalizePcPart(p, categoria) {
  const {
    nucleos, hilos, velocidad, tdp, vram, potencia,
    capacidad, tipo, velocidadLec, chipset, socket,
    formatoRam, slotsRam, certificacion, modular,
    formato, ventanas, tdpSoporte,
  } = p
  const specs = {}
  if (socket)        specs['Socket']    = socket
  if (nucleos)       specs['Núcleos']   = `${nucleos}C/${hilos ?? ''}T`
  if (velocidad)     specs['Velocidad'] = velocidad
  if (tdp)           specs['TDP']       = `${tdp}W`
  if (vram)          specs['VRAM']      = vram
  if (potencia && categoria === 'gpu') specs['TDP']      = `${potencia}W`
  if (capacidad)     specs['Capacidad'] = capacidad
  if (tipo)          specs['Tipo']      = tipo
  if (velocidadLec)  specs['Lectura']   = velocidadLec
  if (chipset)       specs['Chipset']   = chipset
  if (formatoRam)    specs['RAM']       = `${formatoRam} x${slotsRam ?? ''}`
  if (certificacion) specs['Cert.']     = certificacion
  if (modular !== undefined) specs['Modular'] = modular ? 'Sí' : 'No'
  if (potencia && categoria === 'psu') specs['Potencia'] = `${potencia}W`
  if (formato)       specs['Formato']   = formato
  if (ventanas !== undefined) specs['Ventana'] = ventanas ? 'Sí' : 'No'
  if (tdpSoporte)    specs['TDP max']   = `${tdpSoporte}W`
  return { ...p, categoria: LABELS[categoria] ?? categoria, precioNormal: undefined, descuento: 0, specs }
}

function normalizeCelular(c) {
  const { pantalla, procesador, ram, almacenamiento, bateria } = c.specs ?? {}
  const specs = {}
  if (pantalla)       specs['Pantalla'] = pantalla
  if (procesador)     specs['CPU']      = procesador
  if (ram)            specs['RAM']      = ram
  if (almacenamiento) specs['Storage']  = almacenamiento
  if (bateria)        specs['Batería']  = bateria
  return {
    id: c.id, nombre: `${c.marca} ${c.modelo}`,
    marca: c.marca, precio: c.precio,
    precioNormal: c.precioNormal, descuento: c.descuento ?? 0,
    imagen: c.imagen, categoria: 'Celular', specs, _raw: c,
  }
}

const SORT_OPTIONS = [
  { value: 'default',     label: 'Relevancia' },
  { value: 'precio-asc',  label: 'Precio: menor → mayor' },
  { value: 'precio-desc', label: 'Precio: mayor → menor' },
  { value: 'nombre-asc',  label: 'Nombre A → Z' },
]

const CATEGORY_ALIASES = {
  Celulares: 'Celular',
  celulares: 'Celular',
  Celular: 'Celular',
  celular: 'Celular',
  Laptops: 'Laptop',
  laptops: 'Laptop',
  Televisores: 'Televisor',
  televisores: 'Televisor',
  Drones: 'Drone',
  drones: 'Drone',
  'Motos eléctricas': 'Moto eléctrica',
  'motos eléctricas': 'Moto eléctrica',
  Accesorios: 'Accesorios',
  accesorios: 'Accesorios',
  Cargadores: 'Cargadores',
  cargadores: 'Cargadores',
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
        const { PC_PARTS } = await import('../data/mockComponentesPc')
        const pcNormalizados  = Object.entries(PC_PARTS).flatMap(([cat, items]) =>
          items.map(item => normalizePcPart(item, cat))
        )
        const celNormalizados = CELULARES.map(normalizeCelular)
        setTodosLosProductos([...pcNormalizados, ...celNormalizados])
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

        {/* ── HEADER ── */}
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

        {/* ── CARRUSEL DESTACADOS ── */}
        {!loading && (
          <FeaturedCarousel productos={todosLosProductos} />
        )}

        {/* ── TOOLBAR ── */}
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

        {/* ── GRID ── */}
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
        <div style={{ height: 8,  width: '35%', background: 'var(--border)',      borderRadius: 2, marginBottom: 8 }} />
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
