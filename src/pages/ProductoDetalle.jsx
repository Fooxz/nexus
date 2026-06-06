// src/pages/ProductoDetalle.jsx
// Página /productos/:id
// Recibe el producto via location.state (sin fetch extra).
// Muestra specs completas + más productos al azar de la misma categoría.

import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar        from '../components/Navbar'
import Footer        from '../components/Footer'
import ProductCard   from '../components/ProductCard'
import CheckoutModal from '../components/CheckoutModal'
import CommentsSection from '../components/CommentsSection'
import { useCart }   from '../context/CartContext'
import '../styles/productos/productDetail.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const LABELS = {
  cpu:'CPU', gpu:'GPU', ram:'RAM', motherboard:'Motherboard',
  storage:'Almacenamiento', psu:'Fuente', case:'Gabinete', cooling:'Refrigeración',
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
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
    nombre:      prod.nombre ?? `${prod.marca} ${c.modelo}`,
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

export default function ProductoDetalle() {
  const { state }                  = useLocation()
  const navigate                   = useNavigate()
  const { agregar, estaEnCarrito } = useCart()

  const [showCheckout, setShowCheckout] = useState(false)
  const [masProductos, setMasProductos] = useState([])
  const [agregado,     setAgregado]     = useState(false)

  const producto = state?.producto

  useEffect(() => {
    if (!producto) navigate('/productos', { replace: true })
  }, [producto, navigate])

  useEffect(() => {
    if (!producto) return
    async function cargar() {
      try {
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
        const relacionados = todos.filter(p =>
          p.id !== producto.id
        )
        setMasProductos(shuffle(relacionados).slice(0, 8))
      } catch (e) {
        console.error(e)
      }
    }
    cargar()
  }, [producto?.id])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [producto?.id])

  if (!producto) return null

  const agotado = (producto.stock ?? 0) === 0

  const {
    nombre, marca, precio, precioNormal,
    descuento, imagen, categoria, specs = {}
  } = producto

  const enCarrito   = estaEnCarrito(producto.id)
  const specEntries = Object.entries(specs).filter(([, v]) => v !== undefined && v !== null && v !== '')

  const handleAgregarCarrito = () => {
    agregar({ ...producto })
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  return (
    <>
      <Navbar />
      <main className="detail-page">
        <div className="container">

          {/* Breadcrumb */}
          <nav className="detail-breadcrumb">
            <Link to="/">Inicio</Link>
            <span className="detail-breadcrumb__sep">/</span>
            <Link to="/productos">Productos</Link>
            <span className="detail-breadcrumb__sep">/</span>
            {categoria && <><span>{categoria}</span><span className="detail-breadcrumb__sep">/</span></>}
            <span className="detail-breadcrumb__current">{nombre}</span>
          </nav>

          {/* Hero */}
          <div className="detail-hero">
            <div className="detail-img-wrap">
              <img
                className="detail-img" src={imagen} alt={nombre}
                onError={e => { e.target.style.opacity = '.2' }}
              />
            </div>

            <div className="detail-info">
              <div className="detail-info__eyebrow" style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                {marca && <span>{marca}</span>}
                {categoria && <span className="badge badge-muted">{categoria}</span>}
                {agotado && <span className="badge badge-danger">Agotado</span>}
              </div>

              <h1 className="detail-info__title">{nombre}</h1>

              <div className="detail-info__prices">
                <span className="detail-info__price">${precio.toLocaleString('es-CO')}</span>
                {precioNormal && precioNormal !== precio && (
                  <span className="detail-info__price-old">${precioNormal.toLocaleString('es-CO')}</span>
                )}
                {descuento > 0 && (
                  <span className="detail-info__discount">−{descuento}%</span>
                )}
              </div>

              {/* Specs rápidas */}
              {specEntries.length > 0 && (
                <div className="detail-specs-quick">
                  {specEntries.slice(0, 6).map(([k, v]) => (
                    <div key={k} className="detail-spec-item">
                      <span className="detail-spec-label">{k}</span>
                      <span className="detail-spec-val">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Acciones */}
              <div className="detail-actions">
                <button
                  type="button"
                  className="detail-btn-buy"
                  onClick={() => !agotado && setShowCheckout(true)}
                  disabled={agotado}
                >
                  Comprar ahora
                </button>
                <button
                  type="button"
                  className={`detail-btn-cart ${enCarrito ? 'in-cart' : ''}`}
                  onClick={handleAgregarCarrito}
                  disabled={agotado}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {agregado ? '✓ Agregado' : enCarrito ? 'En carrito' : 'Agregar al carrito'}
                </button>
              </div>
            </div>
          </div>

          {/* Specs completas */}
          {specEntries.length > 0 && (
            <section className="detail-specs-full">
              <h2 className="detail-section-title">Especificaciones</h2>
              <div className="detail-specs-table">
                {specEntries.map(([k, v]) => (
                  <div key={k} className="detail-spec-row">
                    <span className="detail-spec-row__key">{k}</span>
                    <span className="detail-spec-row__val">{String(v)}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Más productos */}
          {/* Comentarios */}
          <section className="detail-comments">
            <CommentsSection productId={producto.id} />
          </section>

          {/* Más productos */}
          {masProductos.length > 0 && (
            <section className="detail-more">
              <h2 className="detail-section-title">También te puede interesar</h2>
              <div className="detail-more-grid">
                {masProductos.map(p => (
                  <ProductCard
                    key={p.id}
                    producto={p}
                    enCarrito={estaEnCarrito(p.id)}
                    onVerDetalle={prod =>
                      navigate(`/productos/${prod.id}`, { state: { producto: prod } })
                    }
                    onAgregarCarrito={prod => agregar({ ...prod })}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer />

      {showCheckout && (
        <CheckoutModal
          items={[{ id: producto.id, productoId: producto.id, nombre, precio, cantidad: 1 }]}
          total={precio}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  )
}
