// =============================================
// NEXUS — VentajasPanel
// Responsabilidad única: renderizar ventajas comparativas.
// Recibe ventajas ya calculadas — no hace cálculos.
// =============================================

export default function VentajasPanel({ ventajas, nombreA, nombreB, colorA, colorB }) {
  const ventA = ventajas.filter(v => v.ganador === 'a')
  const ventB = ventajas.filter(v => v.ganador === 'b')

  return (
    <div className="ventajas-wrap">
      {/* Columna A */}
      <div className="ventajas-col">
        <p className="ventajas-title" style={{ color: colorA }}>
          ¿En qué es mejor <span>{nombreA}</span>?
        </p>
        {ventA.length === 0
          ? <p className="ventajas-empty">Sin ventajas claras</p>
          : ventA.map(v => (
              <VentajaItem
                key={v.campo}
                ventaja={v}
                color={colorA}
                labelPropio={v.labelA}
                labelRival={v.labelB}
              />
            ))
        }
      </div>

      {/* Columna B */}
      <div className="ventajas-col">
        <p className="ventajas-title" style={{ color: colorB }}>
          ¿En qué es mejor <span>{nombreB}</span>?
        </p>
        {ventB.length === 0
          ? <p className="ventajas-empty">Sin ventajas claras</p>
          : ventB.map(v => (
              <VentajaItem
                key={v.campo}
                ventaja={v}
                color={colorB}
                labelPropio={v.labelB}
                labelRival={v.labelA}
              />
            ))
        }
      </div>
    </div>
  )
}

function VentajaItem({ ventaja, color, labelPropio, labelRival }) {
  return (
    <div className="ventaja-item">
      <div className="ventaja-check" style={{ background: color }}>✓</div>
      <div className="ventaja-content">
        <p className="ventaja-campo">{ventaja.campo}</p>
        <p className="ventaja-pct" style={{ color }}>
          {ventaja.pct}% {ventaja.invertido ? 'más económico' : 'mejor'}
        </p>
        <p className="ventaja-vals">
          <strong style={{ color }}>{labelPropio}</strong>
          <span className="ventaja-vs"> vs </span>
          <span className="ventaja-rival">{labelRival}</span>
        </p>
      </div>
    </div>
  )
}
