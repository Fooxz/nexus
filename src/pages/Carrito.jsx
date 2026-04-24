import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Carrito() {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('nexus_cart') || '[]')
      setItems(cart)
    } catch { setItems([]) }
  }, [])

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index)
    setItems(updated)
    localStorage.setItem('nexus_cart', JSON.stringify(updated))
  }

  const total = items.reduce((sum, item) => {
    if (item.type === 'build') return sum + item.total
    return sum + (item.precio || 0)
  }, 0)

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container" style={{ paddingBlock: '3rem' }}>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem',
              letterSpacing: '4px', textTransform: 'uppercase',
              color: 'var(--accent)', marginBottom: '.5rem' }}>Mi carrito</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem',
              fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Carrito
            </h1>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.8rem',
                letterSpacing: '2px', textTransform: 'uppercase',
                color: 'var(--muted)', marginBottom: '2rem' }}>
                Tu carrito está vacío
              </p>
              <Link to="/productos" className="btn-solid"
                style={{ padding: '.85rem 2rem', fontSize: '.8rem',
                  letterSpacing: '2px', textTransform: 'uppercase' }}>
                Ver productos
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid',
              gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)',
                    border: '1px solid var(--border)', borderRadius: '4px',
                    padding: '1.25rem', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem',
                        letterSpacing: '2px', textTransform: 'uppercase',
                        color: 'var(--accent)', marginBottom: '.25rem' }}>
                        {item.type === 'build' ? 'PC Build' : 'Producto'}
                      </p>
                      {item.type === 'build' ? (
                        <div>
                          {item.items?.slice(0, 3).map((part, j) => (
                            <p key={j} style={{ fontSize: '.85rem',
                              color: 'var(--text)', marginBottom: '.2rem' }}>
                              {part.nombre}
                            </p>
                          ))}
                          {item.items?.length > 3 && (
                            <p style={{ fontSize: '.75rem', color: 'var(--muted)' }}>
                              +{item.items.length - 3} más
                            </p>
                          )}
                        </div>
                      ) : (
                        <p style={{ fontSize: '.9rem', color: 'var(--text)' }}>
                          {item.nombre}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700,
                        color: 'var(--accent)', fontSize: '1rem' }}>
                        ${(item.total || item.precio || 0).toLocaleString()}
                      </span>
                      <button onClick={() => removeItem(i)}
                        style={{ background: 'none', border: 'none',
                          color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem' }}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: '4px',
                padding: '1.5rem', height: 'fit-content' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '.8rem',
                  fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
                  color: 'var(--muted)', marginBottom: '1.5rem',
                  paddingBottom: '.75rem', borderBottom: '1px solid var(--border)' }}>
                  Resumen
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Subtotal</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>
                    ${total.toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  marginBottom: '1.5rem' }}>
                  <span style={{ color: 'var(--muted)', fontSize: '.9rem' }}>Envío</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                    Gratis
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between',
                  paddingTop: '.75rem', borderTop: '1px solid var(--border)',
                  marginBottom: '1.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                    letterSpacing: '1px', textTransform: 'uppercase' }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700,
                    color: 'var(--accent)', fontSize: '1.3rem' }}>
                    ${total.toLocaleString()}
                  </span>
                </div>
                <button className="btn-solid"
                  style={{ width: '100%', padding: '.875rem', fontSize: '.8rem',
                    letterSpacing: '2px', cursor: 'pointer' }}>
                  Confirmar pedido
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}