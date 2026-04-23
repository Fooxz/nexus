// =============================================
// NEXUS — RadarChart
// Responsabilidad única: renderizar el radar SVG.
// Recibe scores ya calculados — no hace cálculos.
// SVG puro, sin Chart.js, sin Recharts.
// =============================================

const EJES = [
  { key: 'rendimiento', label: 'Rendimiento' },
  { key: 'pantalla',    label: 'Pantalla'    },
  { key: 'camaras',     label: 'Cámaras'     },
  { key: 'bateria',     label: 'Batería'     },
  { key: 'memoria',     label: 'Memoria'     },
  { key: 'valor',       label: 'Valor'       },
]

const CX = 160
const CY = 160
const R  = 110  // radio máximo

function polar(angulo, radio) {
  const rad = (angulo - 90) * (Math.PI / 180)
  return {
    x: CX + radio * Math.cos(rad),
    y: CY + radio * Math.sin(rad),
  }
}

function puntos(scores, key) {
  return EJES.map((eje, i) => {
    const angulo = (360 / EJES.length) * i
    const pct    = scores[eje.key]?.[key] ?? 50
    const radio  = (pct / 100) * R
    const p      = polar(angulo, radio)
    return `${p.x},${p.y}`
  }).join(' ')
}

function puntosCirculo(radio) {
  return EJES.map((_, i) => {
    const angulo = (360 / EJES.length) * i
    const p      = polar(angulo, radio)
    return `${p.x},${p.y}`
  }).join(' ')
}

export default function RadarChart({ scores, colorA, colorB, nombreA, nombreB }) {
  const niveles = [0.25, 0.5, 0.75, 1]

  return (
    <div className="radar-wrap">
      <svg
        viewBox="0 0 320 320"
        width="100%"
        className="radar-svg"
        aria-label={`Radar comparativo entre ${nombreA} y ${nombreB}`}
      >
        {/* Niveles de fondo */}
        {niveles.map((n) => (
          <polygon
            key={n}
            points={puntosCirculo(R * n)}
            fill="none"
            stroke="var(--border)"
            strokeWidth="0.5"
            opacity="0.6"
          />
        ))}

        {/* Ejes */}
        {EJES.map((eje, i) => {
          const angulo = (360 / EJES.length) * i
          const outer  = polar(angulo, R)
          return (
            <line
              key={eje.key}
              x1={CX} y1={CY}
              x2={outer.x} y2={outer.y}
              stroke="var(--border)"
              strokeWidth="0.5"
              opacity="0.5"
            />
          )
        })}

        {/* Área B (detrás) */}
        <polygon
          className="radar-area radar-area-b"
          points={puntos(scores, 'b')}
          fill={colorB}
          fillOpacity="0.18"
          stroke={colorB}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Área A (delante) */}
        <polygon
          className="radar-area radar-area-a"
          points={puntos(scores, 'a')}
          fill={colorA}
          fillOpacity="0.18"
          stroke={colorA}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Puntos A */}
        {EJES.map((eje, i) => {
          const angulo = (360 / EJES.length) * i
          const pct    = scores[eje.key]?.a ?? 50
          const radio  = (pct / 100) * R
          const p      = polar(angulo, radio)
          return (
            <circle
              key={`dot-a-${eje.key}`}
              cx={p.x} cy={p.y} r="4"
              fill={colorA}
              className="radar-dot"
            />
          )
        })}

        {/* Puntos B */}
        {EJES.map((eje, i) => {
          const angulo = (360 / EJES.length) * i
          const pct    = scores[eje.key]?.b ?? 50
          const radio  = (pct / 100) * R
          const p      = polar(angulo, radio)
          return (
            <circle
              key={`dot-b-${eje.key}`}
              cx={p.x} cy={p.y} r="4"
              fill={colorB}
              className="radar-dot"
            />
          )
        })}

        {/* Labels de ejes */}
        {EJES.map((eje, i) => {
          const angulo = (360 / EJES.length) * i
          const p      = polar(angulo, R + 22)
          const anchor = p.x < CX - 5 ? 'end' : p.x > CX + 5 ? 'start' : 'middle'
          return (
            <text
              key={`label-${eje.key}`}
              x={p.x} y={p.y}
              textAnchor={anchor}
              dominantBaseline="central"
              className="radar-label"
            >
              {eje.label}
            </text>
          )
        })}
      </svg>

      {/* Leyenda */}
      <div className="radar-legend">
        <span className="radar-legend-item">
          <span className="radar-legend-dot" style={{ background: colorA }} />
          {nombreA}
        </span>
        <span className="radar-legend-item">
          <span className="radar-legend-dot" style={{ background: colorB }} />
          {nombreB}
        </span>
      </div>
    </div>
  )
}
