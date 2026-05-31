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
import { useCart }   from '../context/CartContext'
import { CELULARES } from '../data/mockCelulares'
import '../styles/productos/productDetail.css'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const LABELS = {
  cpu:'CPU', gpu:'GPU', ram:'RAM', motherboard:'Motherboard',
  storage:'Almacenamiento', psu:'Fuente', case:'Gabinete', cooling:'Refrigeración',
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
      const { PC_PARTS } = await import('../data/mockComponentesPc')

      const pcFlat = Object.entries(PC_PARTS).flatMap(([cat, items]) =>
        items.map(p => ({
          ...p,
          categoria: LABELS[cat] ?? cat,
          specs: {},
          descuento: 0,
        }))
      )
      const celFlat = CELULARES.map(c => ({
        id: c.id, nombre: `${c.marca} ${c.modelo}`,
        marca: c.marca, precio: c.precio,
        precioNormal: c.precioNormal, descuento: c.descuento ?? 0,
        imagen: c.imagen, categoria: 'Celular', specs: c.specs ?? {},
      }))

      const todos = [...pcFlat, ...celFlat]
      const relacionados = todos.filter(p =>
        p.id !== producto.id &&
        (p.categoria === producto.categoria || p.marca === producto.marca)
      )
      setMasProductos(shuffle(relacionados).slice(0, 8))
    }
    cargar()
  }, [producto?.id])

  if (!producto) return null

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
              <div className="detail-info__eyebrow">
                {marca && <span>{marca}</span>}
                {categoria && <span className="badge badge-muted">{categoria}</span>}
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
                <button className="detail-btn-buy" onClick={() => setShowCheckout(true)}>
                  Comprar ahora
                </button>
                <button
                  className={`detail-btn-cart ${enCarrito ? 'in-cart' : ''}`}
                  onClick={handleAgregarCarrito}
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
          items={[{ nombre, precio }]}
          total={precio}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  )
}
