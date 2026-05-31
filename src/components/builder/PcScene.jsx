// =============================================
// NEXUS — PcScene (Placeholder)
// Visualizador 3D desactivado en prototipo.
// Se activa con los assets GLB en producción.
// =============================================

export default function PcScene({ build = {} }) {
  const partes = [
    { key: 'cpu',         label: 'CPU',         icon: '⚡' },
    { key: 'motherboard', label: 'Placa Madre',  icon: '🔧' },
    { key: 'gpu',         label: 'GPU',          icon: '🎮' },
    { key: 'psu',         label: 'Fuente',       icon: '🔌' },
    { key: 'cooling',     label: 'Cooler',       icon: '❄️' },
  ]

  const ramSlots    = build?.ramSlots     ?? []
  const storageSlots = build?.storageSlots ?? []

  const instalados = [
    ...partes.filter(p => build?.[p.key]),
    ...(ramSlots.length     > 0 ? [{ key: 'ram',     label: 'RAM',          icon: '💾' }] : []),
    ...(storageSlots.length > 0 ? [{ key: 'storage',  label: 'Almacenamiento', icon: '💿' }] : []),
  ]

  return (
    <div style={{
      width: '100%',
      aspectRatio: '16/9',
      background: 'var(--bg-base)',
      border: '1px solid var(--border-active)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Grid decorativo */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          repeating-linear-gradient(0deg,  transparent, transparent 29px, rgba(0,229,255,.04) 29px, rgba(0,229,255,.04) 30px),
          repeating-linear-gradient(90deg, transparent, transparent 29px, rgba(0,229,255,.04) 29px, rgba(0,229,255,.04) 30px)
        `,
      }} />

      {/* Orb decorativo */}
      <div style={{
        position: 'absolute',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,255,.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {instalados.length === 0 ? (
        /* Estado vacío */
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '3rem', opacity: .2, marginBottom: '.75rem' }}>🖥️</div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '.72rem',
            letterSpacing: '2px', textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            Selecciona componentes para ver el ensamblado
          </p>
        </div>
      ) : (
        /* Componentes instalados */
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '.6rem',
            letterSpacing: '3px', textTransform: 'uppercase',
            color: 'var(--accent)', marginBottom: '1.25rem', opacity: .8,
          }}>
            // Componentes instalados
          </p>
          <div style={{
            display: 'flex', flexWrap: 'wrap',
            gap: '.75rem', justifyContent: 'center',
            maxWidth: '480px',
          }}>
            {instalados.map(p => (
              <div key={p.key} style={{
                background: 'var(--bg-elevated)',
                border: '1px solid rgba(0,229,255,.25)',
                borderRadius: 'var(--radius-sm)',
                padding: '.5rem .875rem',
                display: 'flex', alignItems: 'center', gap: '.5rem',
              }}>
                <span style={{ fontSize: '1rem' }}>{p.icon}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '.65rem',
                  letterSpacing: '1px', textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: '.58rem',
            letterSpacing: '2px', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginTop: '1.25rem', opacity: .6,
          }}>
            Visualización 3D disponible con assets instalados
          </p>
        </div>
      )}
    </div>
  )
}
