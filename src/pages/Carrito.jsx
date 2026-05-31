import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { confirmarPedido } from '../services/carritoService'
import '../styles/carrito.css'

const fmt = (n) =>
  typeof n === 'number'
    ? `$${n.toLocaleString('es-CO')}`
    : n

export default function Carrito() {
  const { items, quitar, cambiarCantidad, vaciar, totalItems, totalPrecio } = useCart()
  const { isAuthenticated, token } = useAuth()
  const navigate = useNavigate()

  const [estado, setEstado]   = useState('idle')
  const [pedidoId, setPedidoId] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleConfirmar = () => {
    if (!isAuthenticated) {
      setEstado('login-gate')
      return
    }
    procesarPedido()
  }

  const procesarPedido = async () => {
    setEstado('loading')
    try {
      const resultado = await confirmarPedido(items, token)
      setPedidoId(resultado.pedidoId)
      vaciar()
      setEstado('success')
    } catch (e) {
      setErrorMsg(e.message)
      setEstado('error')
    }
  }

  const envioEstimado = totalPrecio > 500_000 ? 'Gratis' : fmt(15_000)
  const totalConEnvio = totalPrecio > 500_000 ? totalPrecio : totalPrecio + 15_000

  return (
    <>
      <Navbar />

      <main className="carrito-page">
        <section className="carrito-header">
          <div className="container carrito-header__inner">
            <p className="carrito-header__eyebrow">Tu selección</p>
            <h1 className="carrito-header__title">
              <span className="outline">Carrito</span>{' '}
              <span className="accent">de compra</span>
            </h1>
          </div>
        </section>

        <div className="container carrito-body">
          <div>
            {items.length === 0 ? (
              <div className="carrito-empty">
                <div className="carrito-empty__icon">◈</div>
                <p className="carrito-empty__title">Tu carrito está vacío</p>
                <p className="carrito-empty__desc">Agrega productos desde el catálogo</p>
                <Link className="btn btn-primary btn-sm" to="/productos">
                  Ver productos
                </Link>
              </div>
            ) : (
              <ul className="carrito-lista">
                {items.map(item => (
                  <li key={item.id} className="carrito-item">
                    <div className="carrito-item__img-wrap">
                      <img
                        className="carrito-item__img"
                        src={item.imagen}
                        alt={item.nombre}
                        loading="lazy"
                        onError={e => { e.target.style.opacity = '.2' }}
                      />
                    </div>

                    <div className="carrito-item__info">
                      {item.categoria && (
                        <span className="carrito-item__cat">{item.categoria}</span>
                      )}
                      <span className="carrito-item__nombre">{item.nombre}</span>
                      <span className="carrito-item__precio-unit">
                        {fmt(item.precio)} / unidad
                      </span>
                    </div>

                    <div className="carrito-item__controls">
                      <div className="qty-stepper">
                        <button
                          className="qty-stepper__btn"
                          onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                          aria-label="Reducir cantidad"
                        >−</button>
                        <span className="qty-stepper__val">{item.cantidad}</span>
                        <button
                          className="qty-stepper__btn"
                          onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                          aria-label="Aumentar cantidad"
                        >+</button>
                      </div>

                      <span className="carrito-item__subtotal">
                        {fmt(item.precio * item.cantidad)}
                      </span>

                      <button
                        className="carrito-item__delete"
                        onClick={() => quitar(item.id)}
                        aria-label="Eliminar producto"
                        title="Eliminar"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <aside className="carrito-resumen">
              <div className="carrito-resumen__header">
                <span className="carrito-resumen__title">Resumen</span>
                <span className="carrito-resumen__count">
                  {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
                </span>
              </div>

              <div className="carrito-resumen__rows">
                <div className="resumen-row">
                  <span className="resumen-row__label">Subtotal</span>
                  <span className="resumen-row__val">{fmt(totalPrecio)}</span>
                </div>
                <div className="resumen-row">
                  <span className="resumen-row__label">Envío</span>
                  <span className="resumen-row__val"
                    style={{ color: envioEstimado === 'Gratis' ? 'var(--success)' : undefined }}>
                    {envioEstimado}
                  </span>
                </div>
                <div className="resumen-row resumen-row--total">
                  <span className="resumen-row__label">Total</span>
                  <span className="resumen-row__val">{fmt(totalConEnvio)}</span>
                </div>
              </div>

              <div className="carrito-resumen__footer">
                <button
                  className="btn-confirmar"
                  onClick={handleConfirmar}
                  disabled={estado === 'loading'}
                >
                  {estado === 'loading' ? 'Procesando...' : 'Confirmar pedido'}
                </button>
                <button className="btn-vaciar" onClick={vaciar}>
                  Vaciar carrito
                </button>
                {estado === 'error' && (
                  <p style={{
                    fontFamily: 'var(--font-mono)', fontSize: '.68rem',
                    color: 'var(--danger)', textAlign: 'center',
                    letterSpacing: '1px'
                  }}>
                    {errorMsg}
                  </p>
                )}
              </div>
            </aside>
          )}
        </div>
      </main>

      <Footer />

      {estado === 'login-gate' && (
        <div className="cart-modal-overlay" onClick={() => setEstado('idle')}>
          <div className="cart-modal" onClick={e => e.stopPropagation()}>
            <div className="cart-modal__header">
              <p className="cart-modal__eyebrow">Acceso requerido</p>
              <h2 className="cart-modal__title">Inicia sesión para continuar</h2>
            </div>
            <div className="cart-modal__body">
              <p className="cart-modal__desc">
                Para confirmar tu pedido necesitas una cuenta. Tu carrito se
                guardará mientras inicias sesión.
              </p>
              <div className="cart-modal__actions">
                <Link className="btn-solid" to="/login">Ingresar</Link>
                <Link className="btn-solid" to="/register"
                  style={{ background: 'transparent', border: '1px solid var(--border-hi)', color: 'var(--text)' }}>
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {estado === 'success' && (
        <div className="cart-modal-overlay">
          <div className="cart-modal">
            <div className="pedido-ok">
              <div className="pedido-ok__icon">✓</div>
              <h2 className="pedido-ok__title">¡Pedido confirmado!</h2>
              <p className="pedido-ok__id">{pedidoId}</p>
              <p className="pedido-ok__desc">
                Tu pedido fue registrado exitosamente. Te contactaremos pronto.
              </p>
              <button
                className="btn-confirmar"
                style={{ marginTop: '1.5rem' }}
                onClick={() => navigate('/productos')}
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
