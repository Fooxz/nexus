
import { SLOT_CONFIG } from '../../data/slotConfig'

export default function BuilderSidebar({
  build, total, wattage, psuWatts, wattPct, wattStatus,
  progress, canAddToCart, compatibility, onAddToCart
}) {
  const circumference = 2 * Math.PI * 27
  const dashOffset = circumference - (progress / 100) * circumference

  const handleAddToCart = onAddToCart || (() => {})

  return (
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
        <div className="price-breakdown" style={{marginTop:'.875rem'}}>
          {SLOT_CONFIG.filter(s => build[s.id]).map(s => (
            <div key={s.id} className="price-row">
              <span className="price-row-label">{s.label}</span>
              <span className="price-row-val">${build[s.id].precio}</span>
            </div>
          ))}
        </div>
        <div className="price-total-row" style={{marginTop:'.75rem'}}>
          <span className="price-total-label">Total</span>
          <span className="price-total-val">${total.toLocaleString()}</span>
        </div>
      </div>

      {/* WATTAGE */}
      <div>
        <div className="summary-title">Consumo estimado</div>
        <div style={{marginTop:'.875rem'}}>
          <div className="watt-header">
            <span className="watt-label">Potencia del sistema</span>
            <span className="watt-val">{wattage > 100 ? `~${wattage}W` : '—'}</span>
          </div>
          <div className="watt-bar-track">
            <div
              className={`watt-bar-fill${wattStatus ? ` ${wattStatus}` : ''}`}
              style={{width:`${wattPct}%`}}
            />
          </div>
        </div>
      </div>

      {/* COMPATIBILITY */}
      <div>
        <div className="summary-title">Compatibilidad</div>
        <div className="compat-list" style={{marginTop:'.875rem'}}>
          {compatibility.length === 0
            ? <p style={{color:'var(--text-muted)',fontSize:'.8rem',fontFamily:'var(--font-mono)'}}>
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

      {/* ADD TO CART */}
      <div style={{marginTop:'auto',paddingTop:'1rem',borderTop:'1px solid var(--border)'}}>
        <button
          className="btn btn-primary add-cart-btn"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          style={{width:'100%',padding:'.875rem',fontSize:'.9rem',letterSpacing:'2px',justifyContent:'center',opacity: canAddToCart ? 1 : .5,cursor: canAddToCart ? 'pointer' : 'not-allowed'}}
        >
          🛒 Agregar al carrito
        </button>
        {!canAddToCart && (
          <p style={{fontSize:'.75rem',color:'var(--text-muted)',textAlign:'center',marginTop:'.5rem'}}>
            Completa los componentes requeridos <span className="text-danger">*</span>
          </p>
        )}
      </div>

    </aside>
  )
}
