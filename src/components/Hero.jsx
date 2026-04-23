import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const CATEGORIES = ['Todo','Celulares','Laptops','Televisores','Drones','Motos eléctricas','Accesorios','Cargadores']
const IMAGES = ['/imagenes/imagen1.png','/imagenes/imagen2.png','/imagenes/imagen3.png','/imagenes/imagen4.png','/imagenes/imagen5.png']
const DURATION = 3500

export default function Hero() {
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [current, setCurrent] = useState(0)
  const timerRef = useRef(null)
  const wrapRef = useRef(null)

  const goTo = (idx) => {
    const next = (idx + IMAGES.length) % IMAGES.length
    setCurrent(next)
    // restart progress bar
    if (wrapRef.current) {
      wrapRef.current.style.animation = 'none'
      void wrapRef.current.offsetHeight
      wrapRef.current.style.animation = ''
    }
  }

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % IMAGES.length), DURATION)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <section className="hero">
      <span className="hero__bg-word" aria-hidden="true">NEXUS</span>
      <p className="hero__badge" aria-hidden="true">// Season 2026</p>

      <div className="hero__content">
        <div className="container">
          <div className="hero__inner">

            {/* LEFT */}
            <div className="hero__left">
              <p className="hero__eyebrow">Tienda de tecnología</p>
              <h1 className="hero__title">
                La tech que<br/>
                <span className="outline">quieres,</span><br/>
                <span className="accent">al siguiente nivel.</span>
              </h1>
              <p className="hero__desc">
                Celulares, laptops, drones, TVs, motos eléctricas y más —
                todo lo que mueve tu mundo, en un solo lugar.
              </p>
              <div className="hero__actions">
                <Link className="btn-hero-primary" to="/productos">Explorar catálogo</Link>
                <a className="btn-hero-ghost" href="#categorias">Ver categorías</a>
              </div>
            </div>

            {/* CAROUSEL */}
            <div className="hero__carousel">
              <div
                className="carousel__track-wrap"
                ref={wrapRef}
                style={{ '--carousel-duration': `${DURATION}ms` }}
                onMouseEnter={() => clearInterval(timerRef.current)}
                onMouseLeave={startTimer}
              >
                <div
                  className="carousel__track"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {IMAGES.map((src, i) => (
                    <img key={i} className="carousel__slide" src={src} alt={`Producto ${i + 1}`} />
                  ))}
                </div>
              </div>
              <div className="carousel__dots">
                {IMAGES.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel__dot${i === current ? ' active' : ''}`}
                    aria-label={`Imagen ${i + 1}`}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* CATEGORY PILLS */}
          <nav className="hero__cats" id="categorias" aria-label="Categorías">
            {CATEGORIES.map(cat => (
              <span
                key={cat}
                className={`hero__cat${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </span>
            ))}
          </nav>

        </div>
      </div>
    </section>
  )
}
