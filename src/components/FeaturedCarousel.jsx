// src/components/FeaturedCarousel.jsx
// Carrusel de productos destacados al azar.
// Recibe todos los productos ya normalizados y elige N al montar.

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import '../styles/productos/productFeatured.css'

const FEATURED_COUNT = 12

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function useVisible() {
  const [visible, setVisible] = useState(4)
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640)       setVisible(2)
      else if (window.innerWidth < 1024) setVisible(3)
      else                               setVisible(4)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return visible
}

export default function FeaturedCarousel({ productos = [] }) {
  const navigate                   = useNavigate()
  const { agregar, estaEnCarrito } = useCart()
  const visible                    = useVisible()
  const [idx,   setIdx]            = useState(0)
  const [items, setItems]          = useState([])
  const intervalRef                = useRef(null)

  useEffect(() => {
    if (productos.length === 0) return
    setItems(shuffle(productos).slice(0, FEATURED_COUNT))
    setIdx(0)
  }, [productos.length])

  const maxIdx = Math.max(0, items.length - visible)
  const prev   = useCallback(() => setIdx(i => Math.max(0, i - 1)), [])
  const next   = useCallback(() => setIdx(i => Math.min(maxIdx, i + 1)), [maxIdx])

  const startAuto = useCallback(() => {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setIdx(i => (i >= maxIdx ? 0 : i + 1))
    }, 4000)
  }, [maxIdx])

  useEffect(() => {
    startAuto()
    return () => clearInterval(intervalRef.current)
  }, [startAuto])

  if (items.length === 0) return null

  return (
    <section className="featured-section">
      <div className="container">

        <div className="featured-header">
          <span className="featured-eyebrow">Destacados</span>
          <div className="featured-nav">
            <button className="featured-nav__btn" onClick={prev} disabled={idx === 0} aria-label="Anterior">‹</button>
            <button className="featured-nav__btn" onClick={next} disabled={idx >= maxIdx} aria-label="Siguiente">›</button>
          </div>
        </div>

        <div
          className="featured-track-wrap"
          onMouseEnter={() => clearInterval(intervalRef.current)}
          onMouseLeave={startAuto}
        >
          <div
            className="featured-track"
            style={{ transform: `translateX(calc(-${idx} * (100% / ${visible})))` }}
          >
            {items.map((p, i) => (
              <FeaturedCard
                key={`${p.id}-${i}`}
                producto={p}
                visible={visible}
                enCarrito={estaEnCarrito(p.id)}
                onVer={() => navigate(`/productos/${p.id}`, { state: { producto: p } })}
                onCarrito={() => agregar({
                  id:        p.id,
                  nombre:    p.nombre,
                  marca:     p.marca    ?? '',
                  precio:    p.precio,
                  imagen:    p.imagen   ?? '',
                  categoria: p.categoria ?? '',
                })}
              />
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="featured-dots">
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button
              key={i}
              className={`featured-dot ${idx === i ? 'active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Ir a grupo ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

function FeaturedCard({ producto, visible, enCarrito, onVer, onCarrito }) {
  const { nombre, marca, precio, descuento, imagen, categoria } = producto
  const width = `calc(${100 / visible}% - 1px)`

  return (
    <article className="featured-card" style={{ width, minWidth: width }}>
      <div className="featured-card__img-wrap" onClick={onVer} style={{ cursor: 'pointer' }}>
        <img
          className="featured-card__img"
          src={imagen} alt={nombre} loading="lazy"
          onError={e => { e.target.style.opacity = '.2' }}
        />
        {descuento > 0 && (
          <span className="featured-card__badge">−{descuento}%</span>
        )}
      </div>

      <div className="featured-card__body" onClick={onVer} style={{ cursor: 'pointer' }}>
        {marca && <p className="featured-card__brand">{marca}</p>}
        <p className="featured-card__name">{nombre}</p>
        {categoria && <p className="featured-card__cat">{categoria}</p>}
      </div>

      <div className="featured-card__footer">
        <span className="featured-card__price">${precio.toLocaleString('es-CO')}</span>
        <button
          className="featured-card__btn"
          onClick={enCarrito ? onVer : onCarrito}
          style={enCarrito
            ? { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)' }
            : {}
          }
        >
          {enCarrito ? 'Ver' : '+ Carrito'}
        </button>
      </div>
    </article>
  )
}
