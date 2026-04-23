// Responsabilidad única: mostrar la tira de miniaturas de componentes instalados
const STRIP_ICONS = {
  cpu:         { icon: '🔵', label: 'CPU' },
  gpu:         { icon: '🔴', label: 'GPU' },
  ram:         { icon: '🟢', label: 'RAM' },
  storage:     { icon: '🟡', label: 'SSD' },
  motherboard: { icon: '🟠', label: 'MB'  },
  psu:         { icon: '🔋', label: 'PSU' },
  cooler:      { icon: '❄️', label: 'FAN' },
}

export default function SceneStrip({ build }) {
  const installed = Object.keys(build).filter(slot => build[slot] && STRIP_ICONS[slot])

  if (installed.length === 0) return null

  return (
    <div className="visual-strip">
      <div className="visual-strip-list">
        {installed.map(slot => (
          <div key={slot} className="strip-thumb active" title={build[slot].nombre}>
            <div className="strip-thumb-icon">{STRIP_ICONS[slot].icon}</div>
            <div className="strip-thumb-label">{STRIP_ICONS[slot].label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
