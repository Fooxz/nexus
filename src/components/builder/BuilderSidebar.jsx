// src/components/builder/BuilderSidebar.jsx
import { useState } from 'react'
import { SLOT_CONFIG } from '../../data/slotConfig'
import CheckoutModal from '../CheckoutModal'

export default function BuilderSidebar({
  build, total, wattage, psuWatts, wattPct, wattStatus,
  progress, canAddToCart, compatibility, onAddToCart
}) {
  const circumference = 2 * Math.PI * 27
  const dashOffset    = circumference - (progress / 100) * circumference
  const [showCheckout, setShowCheckout] = useState(false)

  // Construye los ítems del build para el CheckoutModal
  const buildItems = Object.entries(build)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([slotId, comp]) => {
      const label = SLOT_CONFIG.find(s => s.id === slotId)?.label ?? slotId
      return { nombre: `${label}: ${comp.nombre}`, precio: comp.precio }
    })

  // Filas de precio para slots simples (excluye ram y storage que son arrays)
  const SIMPLE_PRICE_SLOTS = SLOT_CONFIG.filter(
    s => s.id !== 'ram' && s.id !== 'storage'
  )

  return (
    <>
      <aside className="builder-sidebar">

        {/* PROGRESS */}
        <div className="build-progress">
          <div className="progress-ring-wrap">
            <svg className="progress-ring" width="64" height="64" viewBox="0 0 64 64">
              <circle className="progress-ring-bg" cx="32" cy="32" r="27"/>
              <circle
                className="progress-ring-fill" cx="32" cy="32" r="27"
                style={{ strokeDasharray: circumference, strokeDashoffset: dashOffset }}
              />
            </svg>
            <div className="progress-pct">{progress}%</div>
          </div>
          <div className="progress-info">
            <div className="progress-info-title">Completado</div>
            <div className="progress-info-sub">
              {SLOT_CONFIG.filter(s => s.required).length} componentes requeridos
            </div>
          </div>
        </div>

        {/* PRICE BREAKDOWN */}
        <div>
          <div className="summary-title">Desglose de precio</div>
          <div className="price-breakdown" style={{ marginTop: '.875rem' }}>

            {/* Slots simples: cpu, motherboard, gpu, psu, cooling, case */}
            {SIMPLE_PRICE_SLOTS.filter(s => build[s.id]).map(s => (
              <div key={s.id} className="price-row">
                <span className="price-row-label">{s.label}</span>
                <span className="price-row-val">
                  ${build[s.id].precio.toLocaleString('es-CO')}
                </span>
              </div>
            ))}

            {/* RAM — cada módulo instalado */}
            {(build.ramSlots || []).map((r, i) =>
              r?.product ? (
                <div key={`ram-${r.slot ?? i}`} className="price-row">
                  <span className="price-row-label">RAM slot {r.slot ?? i + 1}</span>
                  <span className="price-row-val">
                    ${r.product.precio.toLocaleString('es-CO')}
                  </span>
                </div>
              ) : null
            )}

            {/* Storage — primer slot del array */}
            {(build.storageSlots || []).map((s, i) =>
              s?.product ? (
                <div key={`sto-${s.slot ?? i}`} className="price-row">
                  <span className="price-row-label">Almacenamiento</span>
                  <span className="price-row-val">
                    ${s.product.precio.toLocaleString('es-CO')}
                  </span>
                </div>
              ) : null
            )}

          </div>
          <div className="price-total-row" style={{ marginTop: '.75rem' }}>
            <span className="price-total-label">Total</span>
            <span className="price-total-val">${total.toLocaleString('es-CO')}</span>
          </div>
        </div>

        {/* WATTAGE */}
        <div>
          <div className="summary-title">Consumo estimado</div>
          <div style={{ marginTop: '.875rem' }}>
            <div className="watt-header">
              <span className="watt-label">Potencia del sistema</span>
              <span className="watt-val">{wattage > 100 ? `~${wattage}W` : '—'}</span>
            </div>
            <div className="watt-bar-track">
              <div
                className={`watt-bar-fill${wattStatus ? ` ${wattStatus}` : ''}`}
                style={{ width: `${wattPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* COMPATIBILITY */}
        <div>
          <div className="summary-title">Compatibilidad</div>
          <div className="compat-list" style={{ marginTop: '.875rem' }}>
            {compatibility.length === 0
              ? <p style={{ color: 'var(--text-muted)', fontSize: '.8rem', fontFamily: 'var(--font-mono)' }}>
                  Agrega componentes para verificar.
                </p>
              : compatibility.map((w, i) => (
                  <div key={i} className={`compat-alert ${w.tipo}`}>
                    {w.tipo === 'error' ? '✕' : w.tipo === 'warning' ? '⚠' : '✓'} {w.msg}
                  </div>
                ))
            }
          </div>
        </div>

        {/* ACCIONES */}
        <div style={{
          marginTop: 'auto', paddingTop: '1rem',
          borderTop: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: '.6rem',
        }}>

          <button
            className="btn btn-primary add-cart-btn"
            onClick={() => canAddToCart && setShowCheckout(true)}
            disabled={!canAddToCart}
            style={{
              width: '100%', padding: '.875rem',
              fontSize: '.9rem', letterSpacing: '2px',
              justifyContent: 'center',
              opacity: canAddToCart ? 1 : .5,
              cursor: canAddToCart ? 'pointer' : 'not-allowed',
            }}
          >
            Comprar ahora
          </button>

          <button
            onClick={canAddToCart ? onAddToCart : undefined}
            disabled={!canAddToCart}
            title={canAddToCart ? 'Agregar al carrito' : 'Completa los componentes requeridos'}
            style={{
              width: '100%', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
              background: 'transparent',
              border: '1px solid var(--border-active)',
              color: canAddToCart ? 'var(--text-secondary)' : 'var(--text-muted)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)', fontSize: '.7rem',
              letterSpacing: '2px', textTransform: 'uppercase',
              cursor: canAddToCart ? 'pointer' : 'not-allowed',
              opacity: canAddToCart ? 1 : .5,
              transition: 'border-color .2s, color .2s',
            }}
            onMouseEnter={e => { if (canAddToCart) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-active)'; e.currentTarget.style.color = canAddToCart ? 'var(--text-secondary)' : 'var(--text-muted)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Agregar al carrito
          </button>

          {!canAddToCart && (
            <p style={{
              fontSize: '.72rem', color: 'var(--text-muted)',
              textAlign: 'center', fontFamily: 'var(--font-mono)',
              letterSpacing: '1px',
            }}>
              Completa los componentes requeridos <span className="text-danger">*</span>
            </p>
          )}
        </div>

      </aside>

      {showCheckout && (
        <CheckoutModal
          items={buildItems}
          total={total}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  )
}