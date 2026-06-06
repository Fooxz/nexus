// src/components/comparador/Comparador-componente.jsx
import '../../styles/comparador/comparador.css'
import Navbar          from '../Navbar'
import RadarChart      from './RadarChart'
import VentajasPanel   from './VentajasPanel'
import EspecsGrid      from './EspecsGrid'
import SelectorCelular from './SelectorCelular'
import { useComparador } from '../../hooks/useComparador'
import { useCart }       from '../../context/CartContext'

const COLOR_A = '#00e5ff'
const COLOR_B = '#ff3c5f'

export default function Comparador() {
  const {
    selA, selB,
    modalSlot, busqueda, filtroMarca,
    marcas, productosFiltrados, comparacion,
    abrirModal, cerrarModal, seleccionar,
    limpiarSlot, intercambiar,
    setBusqueda, setFiltroMarca,
  } = useComparador()

  const { agregar, estaEnCarrito } = useCart()

  const tieneAmbos = selA && selB

  return (
    <>
      <Navbar />

      <div className="comp-page">
        <div className="comp-bg" aria-hidden="true">
          <div className="comp-bg-orb comp-bg-orb-a" />
          <div className="comp-bg-orb comp-bg-orb-b" />
          <div className="comp-bg-grid" />
        </div>

        <div className="comp-header">
          <p className="comp-eyebrow">// Comparador</p>
          <h1 className="comp-title">
            Comparador<br/>
            <span className="comp-title-outline">sin límites.</span>
          </h1>
          <p className="comp-subtitle">
            Selecciona dos celulares y descubre cuál domina en cada aspecto.
          </p>
        </div>

        <div className="comp-slots">
          <SlotCard
            producto={selA}
            color={COLOR_A}
            lado="A"
            score={tieneAmbos ? comparacion.scoreGlobalA : null}
            enCarrito={selA ? estaEnCarrito(selA.id) : false}
            onElegir={() => abrirModal('a')}
            onLimpiar={() => limpiarSlot('a')}
            onAgregarCarrito={() => selA && agregar({
              id:        selA.id,
              nombre:    `${selA.marca} ${selA.modelo}`,
              marca:     selA.marca,
              precio:    selA.precio,
              imagen:    selA.imagen,
              categoria: 'Celular',
            })}
          />

          <div className="comp-vs">
            <span className="comp-vs-text">VS</span>
            {tieneAmbos && (
              <button className="comp-swap-btn" onClick={intercambiar} title="Intercambiar">⇄</button>
            )}
          </div>

          <SlotCard
            producto={selB}
            color={COLOR_B}
            lado="B"
            score={tieneAmbos ? comparacion.scoreGlobalB : null}
            enCarrito={selB ? estaEnCarrito(selB.id) : false}
            onElegir={() => abrirModal('b')}
            onLimpiar={() => limpiarSlot('b')}
            onAgregarCarrito={() => selB && agregar({
              id:        selB.id,
              nombre:    `${selB.marca} ${selB.modelo}`,
              marca:     selB.marca,
              precio:    selB.precio,
              imagen:    selB.imagen,
              categoria: 'Celular',
            })}
          />
        </div>

        {tieneAmbos && (
          <div className="comp-result">
            <div className="comp-radar-ventajas">
              <div className="comp-radar-wrap">
                <p className="comp-section-label">Radar comparativo</p>
                <RadarChart
                  scores={comparacion.scores}
                  colorA={COLOR_A} colorB={COLOR_B}
                  nombreA={`${selA.marca} ${selA.modelo}`}
                  nombreB={`${selB.marca} ${selB.modelo}`}
                />
              </div>
              <div className="comp-ventajas-wrap">
                <p className="comp-section-label">Ventajas</p>
                <VentajasPanel
                  ventajas={comparacion.ventajas}
                  nombreA={selA.modelo} nombreB={selB.modelo}
                  colorA={COLOR_A} colorB={COLOR_B}
                />
              </div>
            </div>
            <div className="comp-specs-wrap">
              <p className="comp-section-label">Especificaciones completas</p>
              <EspecsGrid prodA={selA} prodB={selB} colorA={COLOR_A} colorB={COLOR_B} />
            </div>
          </div>
        )}

        {!tieneAmbos && (
          <div className="comp-empty">
            <div className="comp-empty-icon">📱</div>
            <p className="comp-empty-text">
              Selecciona dos celulares arriba para ver la comparación
            </p>
          </div>
        )}
      </div>

      <SelectorCelular
        open={modalSlot !== null}
        slot={modalSlot}
        productos={productosFiltrados}
        busqueda={busqueda}
        filtroMarca={filtroMarca}
        marcas={marcas}
        onBusqueda={setBusqueda}
        onMarca={setFiltroMarca}
        onSelect={seleccionar}
        onClose={cerrarModal}
      />
    </>
  )
}

/* ── SlotCard ── */
function SlotCard({ producto, color, lado, score, enCarrito, onElegir, onLimpiar, onAgregarCarrito }) {
  if (!producto) {
    return (
      <button className="comp-slot comp-slot-empty" onClick={onElegir}>
        <div className="comp-slot-plus" style={{ borderColor: color, color }}>+</div>
        <p className="comp-slot-hint">Elegir celular {lado}</p>
      </button>
    )
  }

  return (
    <div className="comp-slot comp-slot-filled" style={{ '--slot-color': color }}>
      <button className="comp-slot-clear" onClick={onLimpiar}>✕</button>

      <div className="comp-slot-img-wrap">
        <img
          src={producto.imagen} alt={producto.modelo}
          className="comp-slot-img"
          onError={e => { e.target.style.display = 'none' }}
        />
        <div className="comp-slot-img-glow" style={{ background: color }} />
      </div>

      <div className="comp-slot-info">
        <p className="comp-slot-marca" style={{ color }}>{producto.marca}</p>
        <p className="comp-slot-modelo">{producto.modelo}</p>
        <p className="comp-slot-storage">{producto.storage} · {producto.color}</p>
        <p className="comp-slot-precio">
          ${producto.precio.toLocaleString('es-CO')}
          {producto.descuento > 0 && (
            <span className="comp-slot-desc"> -{producto.descuento}%</span>
          )}
        </p>
      </div>

      {score !== null && (
        <div className="comp-slot-score" style={{ color, borderColor: color }}>
          <span className="comp-slot-score-num">{score}</span>
          <span className="comp-slot-score-label">pts</span>
        </div>
      )}

      {/* Botón carrito */}
      <button
        className="comp-slot-change"
        onClick={enCarrito ? undefined : onAgregarCarrito}
        style={{
          marginTop: '.5rem',
          borderColor: enCarrito ? 'var(--success)' : color,
          color:       enCarrito ? 'var(--success)' : color,
          cursor:      enCarrito ? 'default' : 'pointer',
        }}
      >
        {enCarrito ? '✓ En carrito' : '+ Carrito'}
      </button>

      <button
        className="comp-slot-change"
        onClick={onElegir}
        style={{ borderColor: color, color }}
      >
        Cambiar
      </button>
    </div>
  )
}