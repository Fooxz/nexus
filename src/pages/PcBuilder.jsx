// src/pages/PcBuilder.jsx
import '../styles/builder/builder-core.css'
import '../styles/builder/builder-slots.css'
import '../styles/builder/builder-modal.css'
import '../styles/builder/builder-summary.css'
import '../styles/builder/builder-toasts.css'
import '../styles/builder/builder-visualizer.css'

import Navbar         from '../components/Navbar'
import BuilderSlots   from '../components/builder/BuilderSlots'
import BuilderSidebar from '../components/builder/BuilderSidebar'
import BuilderModal   from '../components/builder/BuilderModal'
import PcScene        from '../components/builder/PcScene'
import { useBuilder } from '../hooks/useBuilder'
import { useCart }    from '../context/CartContext'
import { PRESETS_META } from '../data/slotConfig'

export default function PcBuilder() {
  const builder          = useBuilder()
  const { agregar }      = useCart()
  const { hydratedBuild, build } = builder

  const handleAddToCart = () => {
    if (!builder.canAddToCart) return

    // buildToCartItems devuelve { productId, nombre, precio, ... }
    // CartContext necesita { id, nombre, precio, ... }
    const items = builder.getCartItems()

    items.forEach(item => {
      agregar({
        id:        item.productId,          // ← productId, no item.id
        nombre:    item.nombre,
        marca:     item.marca    ?? '',
        precio:    item.precio,
        imagen:    item.imagen   ?? '',
        categoria: item.slot     ?? 'Componente PC',  // slot da contexto ("RAM slot 1")
      })
    })
  }

  return (
    <>
      <Navbar />

      <div
        className="page-header"
        style={{
          padding: '1.5rem 2rem',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem', marginTop: '60px',
        }}
      >
        <div>
          <h1>PC <span>Builder</span></h1>
          <p>Arma tu PC ideal. Verificamos compatibilidad en tiempo real.</p>
        </div>
      </div>

      <div className="builder-layout">
        <div className="builder-main">

          <div style={{ marginBottom: '2rem' }}>
            <PcScene build={hydratedBuild?.components} caseId={build.caseId} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '.75rem',
              fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: '.75rem',
            }}>
              Cargar Preset
            </div>
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {PRESETS_META.map(p => (
                <button key={p.key} className="preset-btn" onClick={() => builder.loadPreset(p.key)}>
                  <span className="preset-name">{p.label}</span>
                  <span className="preset-price">{p.price}</span>
                </button>
              ))}
              <button
                className="btn btn-outline btn-sm"
                onClick={builder.clearBuild}
                style={{ marginLeft: 'auto' }}
              >
                Limpiar build
              </button>
            </div>
          </div>

          <BuilderSlots
            build={hydratedBuild?.components || {}}
            onOpen={builder.openModal}
            onRemove={builder.removePart}
          />
        </div>

        <BuilderSidebar
          build={hydratedBuild?.components || {}}
          total={builder.total}
          wattage={builder.wattage}
          psuWatts={builder.psuWatts}
          wattPct={builder.wattPct}
          wattStatus={builder.wattStatus}
          progress={builder.progress}
          canAddToCart={builder.canAddToCart}
          compatibility={builder.compatibility}
          onAddToCart={handleAddToCart}
        />
      </div>

      <BuilderModal
        open={builder.modalOpen}
        activeSlot={builder.activeSlot}
        parts={builder.filteredParts}
        query={builder.searchQuery}
        onSearch={builder.setSearchQuery}
        onSelect={builder.selectPart}
        onClose={builder.closeModal}
      />
    </>
  )
}