// src/components/CheckoutModal.jsx
// Modal de pago simulado — reutilizable en Productos, Comparador y PcBuilder.
// Recibe: items [{ nombre, precio }], total, onClose
// No necesita login — la validación de sesión la hace el padre si quiere.

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/CheckoutModal.css'

const METODOS = [
  { id: 'tarjeta',   label: 'Tarjeta' },
  { id: 'nequi',     label: 'Nequi' },
  { id: 'pse',       label: 'PSE' },
  { id: 'efectivo',  label: 'Efectivo' },
]

function fmtCOP(n) {
  return `$${Number(n).toLocaleString('es-CO')}`
}

function generarOrden() {
  return `NX-${Date.now().toString(36).toUpperCase()}`
}

// Formatea número de tarjeta con espacios cada 4 dígitos
function fmtCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
// Formatea fecha MM/AA
function fmtFecha(val) {
  const d = val.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d
}

export default function CheckoutModal({ items = [], total = 0, onClose }) {
  const navigate = useNavigate()

  // 'form' | 'loading' | 'success'
  const [fase, setFase]       = useState('form')
  const [metodo, setMetodo]   = useState('tarjeta')
  const [ordenId, setOrdenId] = useState('')

  const [form, setForm] = useState({
    nombre:   '',
    numero:   '',
    fecha:    '',
    cvv:      '',
    // Nequi / PSE
    telefono: '',
    banco:    '',
  })
  const [errores, setErrores] = useState({})

  const set = (campo, val) => {
    setForm(prev => ({ ...prev, [campo]: val }))
    setErrores(prev => ({ ...prev, [campo]: false }))
  }

  const validar = () => {
    const e = {}
    if (!form.nombre.trim())          e.nombre   = true
    if (metodo === 'tarjeta') {
      if (form.numero.replace(/\s/g,'').length < 16) e.numero = true
      if (form.fecha.length < 5)      e.fecha    = true
      if (form.cvv.length < 3)        e.cvv      = true
    }
    if (metodo === 'nequi') {
      if (form.telefono.replace(/\D/g,'').length < 10) e.telefono = true
    }
    if (metodo === 'pse') {
      if (!form.banco.trim())          e.banco    = true
    }
    setErrores(e)
    return Object.keys(e).length === 0
  }

  const handlePagar = async () => {
    if (!validar()) return
    setFase('loading')
    // Simula latencia de procesamiento
    await new Promise(r => setTimeout(r, 1600))
    setOrdenId(generarOrden())
    setFase('success')
  }

  return (
    <div className="checkout-overlay" onClick={fase === 'form' ? onClose : undefined}>
      <div className="checkout-modal" onClick={e => e.stopPropagation()}>

        {/* ── FORMULARIO ── */}
        {fase === 'form' && (
          <>
            <div className="checkout-modal__header">
              <div className="checkout-modal__titles">
                <p className="checkout-modal__eyebrow">Pago seguro simulado</p>
                <h2 className="checkout-modal__title">Finalizar compra</h2>
              </div>
              <button className="checkout-modal__close" onClick={onClose}>✕</button>
            </div>

            {/* Resumen */}
            <div className="checkout-modal__summary">
              <p className="checkout-modal__summary-label">Resumen del pedido</p>
              <div className="checkout-modal__items">
                {items.map((item, i) => (
                  <div key={i} className="checkout-modal__item">
                    <span className="checkout-modal__item-name">{item.nombre}</span>
                    <span className="checkout-modal__item-price">{fmtCOP(item.precio)}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-modal__total">
                <span className="checkout-modal__total-label">Total</span>
                <span className="checkout-modal__total-val">{fmtCOP(total)}</span>
              </div>
            </div>

            {/* Form */}
            <div className="checkout-modal__form">

              {/* Método de pago */}
              <div className="checkout-field">
                <span className="checkout-field__label">Método de pago</span>
                <div className="checkout-methods">
                  {METODOS.map(m => (
                    <button
                      key={m.id}
                      className={`checkout-method ${metodo === m.id ? 'active' : ''}`}
                      onClick={() => setMetodo(m.id)}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre siempre visible */}
              <div className="checkout-field">
                <label className="checkout-field__label">
                  {metodo === 'tarjeta' ? 'Nombre en la tarjeta' : 'Nombre completo'}
                </label>
                <input
                  className={`checkout-field__input ${errores.nombre ? 'error' : ''}`}
                  placeholder="Como aparece en la tarjeta"
                  value={form.nombre}
                  onChange={e => set('nombre', e.target.value)}
                />
              </div>

              {/* Tarjeta */}
              {metodo === 'tarjeta' && (
                <>
                  <div className="checkout-field">
                    <label className="checkout-field__label">Número de tarjeta</label>
                    <div className="checkout-field__card-wrap">
                      <input
                        className={`checkout-field__input ${errores.numero ? 'error' : ''}`}
                        placeholder="0000 0000 0000 0000"
                        value={form.numero}
                        onChange={e => set('numero', fmtCard(e.target.value))}
                        maxLength={19}
                      />
                      <span className="checkout-field__card-icon">
                        {form.numero.startsWith('4') ? 'VISA' :
                         form.numero.startsWith('5') ? 'MC' :
                         form.numero.startsWith('3') ? 'AMEX' : '💳'}
                      </span>
                    </div>
                  </div>
                  <div className="checkout-field">
                    <div className="checkout-field__row">
                      <div className="checkout-field">
                        <label className="checkout-field__label">Vencimiento</label>
                        <input
                          className={`checkout-field__input ${errores.fecha ? 'error' : ''}`}
                          placeholder="MM/AA"
                          value={form.fecha}
                          onChange={e => set('fecha', fmtFecha(e.target.value))}
                          maxLength={5}
                        />
                      </div>
                      <div className="checkout-field">
                        <label className="checkout-field__label">CVV</label>
                        <input
                          className={`checkout-field__input ${errores.cvv ? 'error' : ''}`}
                          placeholder="•••"
                          value={form.cvv}
                          onChange={e => set('cvv', e.target.value.replace(/\D/g,'').slice(0,4))}
                          maxLength={4}
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Nequi */}
              {metodo === 'nequi' && (
                <div className="checkout-field">
                  <label className="checkout-field__label">Número Nequi (celular)</label>
                  <input
                    className={`checkout-field__input ${errores.telefono ? 'error' : ''}`}
                    placeholder="300 000 0000"
                    value={form.telefono}
                    onChange={e => set('telefono', e.target.value.replace(/\D/g,'').slice(0,10))}
                    maxLength={10}
                  />
                </div>
              )}

              {/* PSE */}
              {metodo === 'pse' && (
                <div className="checkout-field">
                  <label className="checkout-field__label">Banco</label>
                  <input
                    className={`checkout-field__input ${errores.banco ? 'error' : ''}`}
                    placeholder="Ej: Bancolombia, Davivienda..."
                    value={form.banco}
                    onChange={e => set('banco', e.target.value)}
                  />
                </div>
              )}

              {/* Efectivo — sin campos extra */}
              {metodo === 'efectivo' && (
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '.7rem',
                  letterSpacing: '1.5px', color: 'var(--text-muted)',
                  lineHeight: 1.6,
                }}>
                  Con este método recibirás instrucciones de pago al correo registrado.
                </p>
              )}

              <button className="checkout-modal__pay-btn" onClick={handlePagar}>
                Pagar {fmtCOP(total)}
              </button>
            </div>
          </>
        )}

        {/* ── LOADING ── */}
        {fase === 'loading' && (
          <div className="checkout-loading">
            <div className="checkout-spinner" />
            <p className="checkout-loading__text">Procesando pago...</p>
          </div>
        )}

        {/* ── ÉXITO ── */}
        {fase === 'success' && (
          <div className="checkout-success">
            <div className="checkout-success__icon">✓</div>
            <h2 className="checkout-success__title">¡Pago exitoso!</h2>
            <p className="checkout-success__order">{ordenId}</p>
            <p className="checkout-success__buyer">{form.nombre}</p>
            <p className="checkout-success__total">{fmtCOP(total)}</p>
            <p className="checkout-success__desc">
              Tu pedido fue confirmado. Recibirás una notificación con los detalles.
            </p>
            <button
              className="checkout-success__btn"
              onClick={() => { onClose(); navigate('/') }}
            >
              Volver al inicio
            </button>
          </div>
        )}

      </div>
    </div>
  )
}