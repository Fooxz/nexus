// =============================================
// NEXUS — RadarChart (refactorizado)
// Consume scores del comparadorService vía props.
// SVG puro, sin dependencias externas.
// =============================================

const EJES = [
  { label: 'Rendimiento', key: 'rendimiento' },
  { label: 'Pantalla',    key: 'pantalla'    },
  { label: 'Cámara',      key: 'camaras'     },
  { label: 'Batería',     key: 'bateria'     },
  { label: 'Memoria',     key: 'memoria'     },
  { label: 'Valor',       key: 'valor'       },
]

const CX = 210, CY = 210, R = 155

function polar(angleDeg, r) {
  const rad = (angleDeg - 90) * Math.PI / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function poligonoPoints(scores, keys) {
  return keys.map((key, i) => {
    const s = scores[key] ?? 0
    const { x, y } = polar((360 / keys.length) * i, (s / 100) * R)
    return `${x},${y}`
  }).join(' ')
}

export default function RadarChart({
  scores,           // objeto { rendimiento:{a,b}, pantalla:{a,b}, ... }
  colorA, colorB,
  nombreA, nombreB,
}) {
  // Fallback si no hay scores aún
  if (!scores) return null

  const keys    = EJES.map(e => e.key)
  const niveles = [0.2, 0.4, 0.6, 0.8, 1]

  const scoresA = keys.map(k => scores[k]?.a ?? 0)
  const scoresB = keys.map(k => scores[k]?.b ?? 0)

  // DEBUG TEMPORAL
  console.log('RadarChart scores:', scores)
  console.log('scoresA:', scoresA)
  console.log('scoresB:', scoresB)

  const pointsA = poligonoPoints(
    Object.fromEntries(keys.map((k, i) => [k, scoresA[i]])), keys
  )
  const pointsB = poligonoPoints(
    Object.fromEntries(keys.map((k, i) => [k, scoresB[i]])), keys
  )

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: '1.25rem',
    }}>
      <svg
        viewBox="0 0 420 420"
        width="100%"
        style={{ maxWidth: 520 }}
      >
        {/* ── Anillos de nivel ── */}
        {niveles.map(n => (
          <polygon
            key={n}
            points={EJES.map((_, i) => {
              const { x, y } = polar((360 / EJES.length) * i, R * n)
              return `${x},${y}`
            }).join(' ')}
            fill="none"
            stroke="var(--border)"
            strokeWidth="0.75"
            opacity="0.5"
          />
        ))}

        {/* ── Ejes ── */}
        {EJES.map((_, i) => {
          const { x, y } = polar((360 / EJES.length) * i, R)
          return (
            <line key={i}
              x1={CX} y1={CY} x2={x} y2={y}
              stroke="var(--border)" strokeWidth="0.75" opacity="0.4"
            />
          )
        })}

        {/* ── Área B (fondo) ── */}
        <polygon
          points={pointsB}
          fill={colorB}
          fillOpacity="0.12"
          stroke={colorB}
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 8px ${colorB}80)` }}
        />

        {/* ── Área A (frente) ── */}
        <polygon
          points={pointsA}
          fill={colorA}
          fillOpacity="0.12"
          stroke={colorA}
          strokeWidth="2.5"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 8px ${colorA}80)` }}
        />

        {/* ── Puntos A ── */}
        {scoresA.map((s, i) => {
          const { x, y } = polar((360 / EJES.length) * i, (s / 100) * R)
          return (
            <circle key={`a-${i}`}
              cx={x} cy={y} r="4.5"
              fill={colorA}
              style={{ filter: `drop-shadow(0 0 4px ${colorA})` }}
            />
          )
        })}

        {/* ── Puntos B ── */}
        {scoresB.map((s, i) => {
          const { x, y } = polar((360 / EJES.length) * i, (s / 100) * R)
          return (
            <circle key={`b-${i}`}
              cx={x} cy={y} r="4.5"
              fill={colorB}
              style={{ filter: `drop-shadow(0 0 4px ${colorB})` }}
            />
          )
        })}

        {/* ── Labels ── */}
        {EJES.map((eje, i) => {
          const { x, y } = polar((360 / EJES.length) * i, R + 30)
          const anchor = x < CX - 5 ? 'end' : x > CX + 5 ? 'start' : 'middle'
          return (
            <text key={eje.label}
              x={x} y={y}
              textAnchor={anchor}
              dominantBaseline="central"
              style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '12px',
                fontWeight:    600,
                fill:          'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
              }}
            >
              {eje.label}
            </text>
          )
        })}
      </svg>

      {/* ── Leyenda ── */}
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {[
          { nombre: nombreA, color: colorA },
          { nombre: nombreB, color: colorB },
        ].map(l => (
          <span key={l.nombre} style={{
            display: 'flex', alignItems: 'center', gap: '.4rem',
            fontFamily: 'var(--font-mono)', fontSize: '.7rem',
            color: 'var(--text-secondary)',
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: l.color, display: 'inline-block',
              boxShadow: `0 0 6px ${l.color}`,
            }} />
            {l.nombre}
          </span>
        ))}
      </div>
    </div>
  )
}