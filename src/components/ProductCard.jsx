// src/components/ProductCard.jsx
import { useState } from 'react'
import CheckoutModal from './CheckoutModal'
import '../styles/productos/productCard.css'

export default function ProductCard({
  producto,
  enCarrito        = false,
  agregadoFeedback = false,
  onAgregarCarrito,
  onVerDetalle,
}) {
  const { nombre, marca, precio, precioNormal, descuento, imagen, categoria, specs = {} } = producto
  const [showCheckout, setShowCheckout] = useState(false)

  const specPills = Object.entries(specs)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .slice(0, 4)

  return (
    <>
      <article className="prod-card">
        {/* Imagen */}
        <div className="prod-card__img-wrap">
          <img
            className="prod-card__img"
            src={imagen} alt={nombre} loading="lazy"
            onError={e => { e.target.style.opacity = '.3' }}
          />
          {descuento > 0 && (
            <span className="prod-card__discount">−{descuento}%</span>
          )}
          {categoria && (
            <span className="prod-card__category">
              <span className="badge badge-muted">{categoria}</span>
            </span>
          )}
        </div>

        {/* Cuerpo */}
        <div className="prod-card__body">
          {marca && <span className="prod-card__brand">{marca}</span>}
          <h3 className="prod-card__name">{nombre}</h3>
          {specPills.length > 0 && (
            <ul className="prod-card__specs">
              {specPills.map(([k, v]) => (
                <li key={k} className="prod-card__spec">{String(v)}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="prod-card__footer">
          <div className="prod-card__prices">
            {precioNormal && precioNormal !== precio && (
              <span className="prod-card__price-old">
                ${precioNormal.toLocaleString('es-CO')}
              </span>
            )}
            <span className="prod-card__price">
              ${precio.toLocaleString('es-CO')}
            </span>
          </div>

          <div className="prod-card__actions">
            {/* Ver detalle */}
            {onVerDetalle && (
              <button
                className="prod-card__btn prod-card__btn--ghost"
                onClick={() => onVerDetalle(producto)}
                title="Ver detalles"
              >
                Ver
              </button>
            )}

            {/* Carrito — botón cuadrado con ícono */}
            {onAgregarCarrito && (
              <button
                className="prod-card__btn prod-card__btn--cart"
                onClick={() => !agregadoFeedback && onAgregarCarrito(producto)}
                title={enCarrito ? 'Ya en carrito' : 'Agregar al carrito'}
                style={
                  agregadoFeedback
                    ? { background: 'var(--success)', color: 'var(--bg-base)', borderColor: 'var(--success)' }
                    : enCarrito
                    ? { background: 'var(--accent-dim)', color: 'var(--accent)', borderColor: 'var(--accent)' }
                    : {}
                }
              >
                {agregadoFeedback ? '✓' : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                )}
              </button>
            )}

            {/* Comprar — botón rectangular directo al checkout */}
            <button
              className="prod-card__btn prod-card__btn--buy"
              onClick={() => setShowCheckout(true)}
            >
              Comprar
            </button>
          </div>
        </div>
      </article>

      {/* Modal de pago */}
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