const FEATURES = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3H8L6 7h12l-2-4z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Catálogo curado',
    desc: 'Solo lo mejor pasa el filtro. Celulares, laptops, drones, TVs y más — seleccionados con criterio.',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Comparador',
    desc: 'Compara specs lado a lado antes de decidir. Benchmarks reales, sin marketing vacío.',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Garantía real',
    desc: 'Todos los productos con garantía del fabricante y soporte técnico local. Siempre respaldado.',
  },
  {
    
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Envío en 48 h',
    desc: 'Compras hoy, lo tienes en dos días. Rápido, rastreable y sin excusas.',
  },
]

const BRANDS = ['Apple','Samsung','DJI','Sony','Xiaomi','LG','Niu','Anker']

export default function Features() {
  return (
    <section className="features" id="por-que">
      <div className="container">

        <div className="features__header">
          <div>
            <p className="features__eyebrow">Por qué elegirnos</p>
            <h2 className="features__title">
              Tecnología<br/>
              <span className="outline">sin</span><br/>
              complicaciones.
            </h2>
          </div>
          <p className="features__subtitle">
            En NEXUS no solo vendemos gadgets — te acompañamos desde
            que eliges hasta que lo recibes en tu puerta.
          </p>
        </div>

        <div className="features__grid">
          {FEATURES.map(f => (
            <article key={f.num} className="feat-card">
              <p className="feat-card__num">{f.num}</p>
              <div className="feat-card__icon">{f.icon}</div>
              <h3 className="feat-card__title">{f.title}</h3>
              <p className="feat-card__desc">{f.desc}</p>
            </article>
          ))}
        </div>

        <div className="features__brands">
          <span className="features__brands-label">Marcas disponibles →</span>
          {BRANDS.map(b => <span key={b} className="brand-pill">{b}</span>)}
        </div>

      </div>
    </section>
  )
}
