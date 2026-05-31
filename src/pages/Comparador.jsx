import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CELULARES } from '../data/celulares'

// ── Radar SVG puro — sin librerías ──────────────────────────
const EJES = ['Pantalla','RAM','Almacen.','Batería','Cámara','Valor']
const CX = 180, CY = 180, R = 130

function polar(angle, r) {
  const rad = (angle - 90) * Math.PI / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function parsearNum(val) {
  if (!val) return 0
  return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0
}

function getScores(cel) {
  if (!cel) return [0,0,0,0,0,0]
  const pantalla = Math.min((parsearNum(cel.specs?.pantalla) / 7.5) * 100, 100)
  const ram      = Math.min((parsearNum(cel.specs?.ram) / 16) * 100, 100)
  const storage  = Math.min((parsearNum(cel.specs?.almacenamiento) / 512) * 100, 100)
  const bateria  = Math.min((parsearNum(cel.specs?.bateria) / 6000) * 100, 100)
  const camara   = Math.min((parsearNum(cel.specs?.camaraPrincipal) / 108) * 100, 100)
  const valor    = cel.precioNormal
    ? Math.min((1 - cel.precio / cel.precioNormal) * 200, 100)
    : 50
  return [pantalla, ram, storage, bateria, camara, valor]
}

function poligonoPath(scores) {
  return scores.map((s, i) => {
    const angle = (360 / scores.length) * i
    const { x, y } = polar(angle, (s / 100) * R)
    return `${x},${y}`
  }).join(' ')
}

function RadarSVG({ celA, celB, colorA, colorB }) {
  const scoresA = getScores(celA)
  const scoresB = getScores(celB)
  const niveles = [0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox="0 0 360 360" width="100%" style={{ maxWidth: 360 }}>
      {/* Niveles */}
      {niveles.map(n => (
        <polygon key={n}
          points={EJES.map((_, i) => {
            const { x, y } = polar((360/EJES.length)*i, R*n)
            return `${x},${y}`
          }).join(' ')}
          fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.6"
        />
      ))}
      {/* Ejes */}
      {EJES.map((_, i) => {
        const { x, y } = polar((360/EJES.length)*i, R)
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y}
          stroke="var(--border)" strokeWidth="0.5" opacity="0.5" />
      })}
      {/* Área B */}
      {celB && <polygon points={poligonoPath(scoresB)}
        fill={colorB} fillOpacity="0.15" stroke={colorB} strokeWidth="2" strokeLinejoin="round" />}
      {/* Área A */}
      {celA && <polygon points={poligonoPath(scoresA)}
        fill={colorA} fillOpacity="0.15" stroke={colorA} strokeWidth="2" strokeLinejoin="round" />}
      {/* Labels */}
      {EJES.map((label, i) => {
        const angle = (360/EJES.length)*i
        const { x, y } = polar(angle, R + 20)
        const anchor = x < CX - 5 ? 'end' : x > CX + 5 ? 'start' : 'middle'
        return (
          <text key={label} x={x} y={y} textAnchor={anchor}
            dominantBaseline="central"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '10px',
              fill: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {label}
          </text>
        )
      })}
    </svg>
  )
}

const COLORES = ['#00e5ff', '#ff3c5f']

export default function Comparador() {
  const [seleccionados, setSeleccionados] = useState([null, null])
  const [queries, setQueries]             = useState(['', ''])
  const [abierto, setAbierto]             = useState(null)

  const buscarResultados = (q) => {
    if (!q) return []
    return CELULARES.filter(c =>
      c.modelo.toLowerCase().includes(q.toLowerCase()) ||
      c.marca.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 6)
  }

  const seleccionar = (idx, cel) => {
    const next = [...seleccionados]; next[idx] = cel; setSeleccionados(next)
    setAbierto(null)
    const q = [...queries]; q[idx] = ''; setQueries(q)
  }

  const limpiar = (idx) => {
    const next = [...seleccionados]; next[idx] = null; setSeleccionados(next)
  }

  const puedeComparar = seleccionados.filter(Boolean).length === 2

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container" style={{ paddingBlock: '3rem' }}>

          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem',
              letterSpacing: '4px', textTransform: 'uppercase',
              color: 'var(--accent)', marginBottom: '.5rem' }}>Comparador</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem',
              fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Compara celulares
            </h1>
          </div>

          {/* Selectores */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem', marginBottom: '3rem' }}>
            {[0, 1].map(idx => (
              <div key={idx}>
                {seleccionados[idx] ? (
                  <div style={{ background: 'var(--bg-card)',
                    border: `1px solid ${COLORES[idx]}`,
                    borderRadius: '4px', padding: '1.25rem',
                    display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={seleccionados[idx].imagen} alt={seleccionados[idx].modelo}
                      style={{ width: '60px', height: '80px', objectFit: 'contain' }}
                      onError={e => e.target.style.display = 'none'} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem',
                        letterSpacing: '2px', textTransform: 'uppercase',
                        color: COLORES[idx], marginBottom: '.25rem' }}>
                        {seleccionados[idx].marca}
                      </p>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                        fontSize: '1rem' }}>{seleccionados[idx].modelo}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.75rem',
                        color: 'var(--muted)' }}>
                        ${seleccionados[idx].precio.toLocaleString()}
                      </p>
                    </div>
                    <button onClick={() => limpiar(idx)}
                      style={{ background: 'none', border: 'none',
                        color: 'var(--danger)', cursor: 'pointer', fontSize: '1.1rem' }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <div style={{ position: 'relative' }}>
                    <input type="text"
                      placeholder={`Buscar celular ${idx + 1}...`}
                      value={queries[idx]}
                      onChange={e => {
                        const q = [...queries]; q[idx] = e.target.value; setQueries(q)
                        setAbierto(idx)
                      }}
                      onFocus={() => setAbierto(idx)}
                      style={{ width: '100%', background: 'var(--bg-card)',
                        border: `1px solid ${COLORES[idx]}`,
                        color: 'var(--text)', padding: '.85rem 1rem',
                        borderRadius: '4px', fontFamily: 'var(--font-body)',
                        fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' }}
                    />
                    {abierto === idx && queries[idx] && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0,
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: '4px', zIndex: 10, maxHeight: '240px', overflowY: 'auto' }}>
                        {buscarResultados(queries[idx]).map(cel => (
                          <div key={cel.id} onClick={() => seleccionar(idx, cel)}
                            style={{ padding: '.75rem 1rem', cursor: 'pointer',
                              display: 'flex', gap: '.75rem', alignItems: 'center',
                              borderBottom: '1px solid var(--border)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-raised)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            <img src={cel.imagen} alt={cel.modelo}
                              style={{ width: '32px', height: '40px', objectFit: 'contain' }}
                              onError={e => e.target.style.display = 'none'} />
                            <div>
                              <p style={{ fontSize: '.85rem', color: 'var(--text)' }}>
                                {cel.marca} {cel.modelo}
                              </p>
                              <p style={{ fontSize: '.75rem', color: 'var(--muted)',
                                fontFamily: 'var(--font-mono)' }}>
                                ${cel.precio.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {buscarResultados(queries[idx]).length === 0 && (
                          <p style={{ padding: '1rem', color: 'var(--muted)',
                            fontFamily: 'var(--font-mono)', fontSize: '.75rem' }}>
                            Sin resultados
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Radar + Specs */}
          {puedeComparar && (
            <>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '4px', padding: '2rem', marginBottom: '2rem',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
                alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '.8rem',
                    fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
                    color: 'var(--muted)', marginBottom: '1rem' }}>
                    Comparativa visual
                  </p>
                  <RadarSVG
                    celA={seleccionados[0]} celB={seleccionados[1]}
                    colorA={COLORES[0]} colorB={COLORES[1]}
                  />
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem',
                    justifyContent: 'center' }}>
                    {seleccionados.map((cel, i) => cel && (
                      <span key={i} style={{ display: 'flex', alignItems: 'center',
                        gap: '.4rem', fontFamily: 'var(--font-mono)', fontSize: '.65rem',
                        color: 'var(--text-secondary)' }}>
                        <span style={{ width: 10, height: 10, borderRadius: '50%',
                          background: COLORES[i], display: 'inline-block' }} />
                        {cel.marca} {cel.modelo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ventajas rápidas */}
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '.8rem',
                    fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
                    color: 'var(--muted)', marginBottom: '1rem' }}>
                    Diferencias clave
                  </p>
                  {[
                    { label: 'Precio',     valA: `$${seleccionados[0].precio.toLocaleString()}`, valB: `$${seleccionados[1].precio.toLocaleString()}` },
                    { label: 'RAM',        valA: seleccionados[0].specs?.ram,        valB: seleccionados[1].specs?.ram },
                    { label: 'Batería',    valA: seleccionados[0].specs?.bateria,    valB: seleccionados[1].specs?.bateria },
                    { label: 'Cámara',     valA: seleccionados[0].specs?.camaraPrincipal, valB: seleccionados[1].specs?.camaraPrincipal },
                    { label: 'Pantalla',   valA: seleccionados[0].specs?.pantalla,   valB: seleccionados[1].specs?.pantalla },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'grid',
                      gridTemplateColumns: '80px 1fr 1fr', gap: '.5rem',
                      padding: '.5rem 0', borderBottom: '1px solid var(--border)',
                      alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem',
                        letterSpacing: '1px', textTransform: 'uppercase',
                        color: 'var(--text-muted)' }}>{row.label}</span>
                      <span style={{ fontSize: '.85rem', color: COLORES[0],
                        fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{row.valA}</span>
                      <span style={{ fontSize: '.85rem', color: COLORES[1],
                        fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{row.valB}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabla specs completas */}
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  background: 'var(--bg-raised)', borderBottom: '2px solid var(--border-active)' }}>
                  <div style={{ padding: '1rem', fontFamily: 'var(--font-display)',
                    fontSize: '.75rem', fontWeight: 700, letterSpacing: '2px',
                    textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Especificación
                  </div>
                  {seleccionados.map((cel, i) => (
                    <div key={i} style={{ padding: '1rem',
                      fontFamily: 'var(--font-display)', fontSize: '.85rem',
                      fontWeight: 700, color: COLORES[i],
                      borderLeft: '1px solid var(--border)' }}>
                      {cel.marca} {cel.modelo}
                    </div>
                  ))}
                </div>

                {[
                  { label: 'Precio',           fn: c => `$${c.precio.toLocaleString()}` },
                  { label: 'Pantalla',          fn: c => c.specs?.pantalla },
                  { label: 'Procesador',        fn: c => c.specs?.procesador },
                  { label: 'RAM',               fn: c => c.specs?.ram },
                  { label: 'Almacenamiento',    fn: c => c.specs?.almacenamiento },
                  { label: 'Cámara principal',  fn: c => c.specs?.camaraPrincipal },
                  { label: 'Cámara frontal',    fn: c => c.specs?.camaraFrontal },
                  { label: 'Batería',           fn: c => c.specs?.bateria },
                  { label: 'NFC',               fn: c => c.specs?.tieneNfc ? '✅' : '❌' },
                  { label: '5G',                fn: c => c.specs?.tiene5g  ? '✅' : '❌' },
                  { label: 'Sistema operativo', fn: c => c.specs?.so },
                ].map((row, ri) => (
                  <div key={ri} style={{ display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    borderTop: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ padding: '.875rem 1rem', fontFamily: 'var(--font-mono)',
                      fontSize: '.7rem', letterSpacing: '1px', textTransform: 'uppercase',
                      color: 'var(--muted)' }}>{row.label}</div>
                    {seleccionados.map((cel, i) => (
                      <div key={i} style={{ padding: '.875rem 1rem',
                        fontSize: '.88rem', color: 'var(--text)',
                        borderLeft: '1px solid var(--border)' }}>
                        {row.fn(cel)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {!puedeComparar && (
            <div style={{ textAlign: 'center', padding: '4rem 0',
              color: 'var(--muted)', fontFamily: 'var(--font-mono)',
              fontSize: '.8rem', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Selecciona 2 celulares para comparar
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}