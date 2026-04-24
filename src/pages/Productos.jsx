import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CELULARES } from '../data/celulares'

const MARCAS = ['Todas', 'Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Motorola', 'Google']

export default function Productos() {
  const [marca, setMarca] = useState('Todas')
  const [query, setQuery] = useState('')
  const [items, setItems] = useState(CELULARES)

  useEffect(() => {
    let result = CELULARES
    if (marca !== 'Todas') result = result.filter(c => c.marca === marca)
    if (query) result = result.filter(c =>
      c.modelo.toLowerCase().includes(query.toLowerCase())
    )
    setItems(result)
  }, [marca, query])

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--bg)' }}>
        <div className="container" style={{ paddingBlock: '3rem' }}>

          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem',
              letterSpacing: '4px', textTransform: 'uppercase',
              color: 'var(--accent)', marginBottom: '.5rem' }}>Catálogo</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem',
              fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Celulares
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap',
            marginBottom: '2rem', alignItems: 'center' }}>
            <input
              type="text" placeholder="Buscar modelo..."
              value={query} onChange={e => setQuery(e.target.value)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text)', padding: '.6rem 1rem', borderRadius: '2px',
                fontFamily: 'var(--font-body)', fontSize: '.9rem',
                outline: 'none', width: '220px' }}
            />
            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              {MARCAS.map(m => (
                <button key={m} onClick={() => setMarca(m)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '.65rem',
                    letterSpacing: '2px', textTransform: 'uppercase',
                    padding: '.4rem 1rem', borderRadius: '1px', cursor: 'pointer',
                    border: '1px solid ' + (marca === m ? 'var(--accent)' : 'var(--border)'),
                    background: marca === m ? 'var(--accent-dim)' : 'transparent',
                    color: marca === m ? 'var(--accent)' : 'var(--muted)' }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem' }}>
            {items.map(cel => (
              <div key={cel.id}
                style={{ background: 'var(--bg-card)',
                  border: '1px solid var(--border)', borderRadius: '4px',
                  overflow: 'hidden', transition: 'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ background: 'var(--bg-raised)', padding: '1.5rem',
                  display: 'flex', justifyContent: 'center' }}>
                  <img src={cel.imagen} alt={cel.modelo}
                    style={{ height: '140px', objectFit: 'contain' }}
                    onError={e => e.target.style.display = 'none'} />
                </div>
                <div style={{ padding: '1rem' }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem',
                    letterSpacing: '2px', textTransform: 'uppercase',
                    color: 'var(--accent)', marginBottom: '.25rem' }}>{cel.marca}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700,
                    fontSize: '1rem', letterSpacing: '1px', marginBottom: '.5rem' }}>
                    {cel.modelo}
                  </p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.75rem',
                    color: 'var(--muted)', marginBottom: '.75rem' }}>
                    {cel.specs.ram} · {cel.specs.almacenamiento}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700,
                      color: 'var(--accent)', fontSize: '.9rem' }}>
                      ${cel.precio.toLocaleString()}
                    </span>
                    <button style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem',
                      letterSpacing: '1px', textTransform: 'uppercase',
                      padding: '.35rem .75rem', background: 'var(--accent)',
                      color: 'var(--bg)', border: 'none', borderRadius: '2px',
                      cursor: 'pointer' }}>
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--muted)',
              fontFamily: 'var(--font-mono)', marginTop: '3rem' }}>
              No se encontraron resultados.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}