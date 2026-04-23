import { SLOT_CONFIG } from '../../data/slotConfig'

export default function BuilderSlots({ build, onOpen, onRemove }) {
  // Cuántos slots RAM tiene la board seleccionada (default 4)
  const maxRamSlots = build?.motherboard?.slotsRam ?? 4

  // Slots RAM ocupados
  const ramSlots = build?.ramSlots ?? []

  return (
    <div className="builder-slots" id="builder-slots">
      {SLOT_CONFIG.map(slot => {

        // RAM — renderiza múltiples slots
        if (slot.id === 'ram') {
          return Array.from({ length: maxRamSlots }, (_, i) => {
            const slotNumber = i + 1
            const entry      = ramSlots.find(r => r.slot === slotNumber)
            const part       = entry?.product ?? null
            const filled     = !!part

            return (
              <div
                key={`ram-${slotNumber}`}
                className={`slot ${filled ? 'slot-filled' : ''}`}
                onClick={() => onOpen('ram', slotNumber)}
              >
                <div className="slot-header">
                  <div className="slot-icon">💾</div>
                  <div className="slot-info">
                    <div className="slot-label">
                      RAM Slot {slotNumber}
                      {slotNumber === 1 && <span className="text-danger"> *</span>}
                    </div>
                    {filled
                      ? <div className="slot-name">{part.nombre}</div>
                      : <div className="slot-empty-text">Haz clic para seleccionar</div>
                    }
                  </div>
                  {filled && (
                    <>
                      <span className="slot-price">${part.precio}</span>
                      <button
                        className="slot-remove"
                        onClick={e => { e.stopPropagation(); onRemove('ram', slotNumber) }}
                        title="Quitar"
                      >✕</button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        }

        // Resto de slots — igual que antes
        const part  = slot.id === 'storage'
          ? (build?.storageSlots?.[0]?.product ?? null)
          : (build?.[slot.id] ?? null)
        const filled = !!part

        return (
          <div
            key={slot.id}
            className={`slot ${filled ? 'slot-filled' : ''}`}
            onClick={() => onOpen(slot.id)}
          >
            <div className="slot-header">
              <div className="slot-icon">{slot.icon}</div>
              <div className="slot-info">
                <div className="slot-label">
                  {slot.label} {slot.required && <span className="text-danger">*</span>}
                </div>
                {filled
                  ? <div className="slot-name">{part.nombre}</div>
                  : <div className="slot-empty-text">Haz clic para seleccionar</div>
                }
              </div>
              {filled && (
                <>
                  <span className="slot-price">${part.precio}</span>
                  <button
                    className="slot-remove"
                    onClick={e => { e.stopPropagation(); onRemove(slot.id) }}
                    title="Quitar"
                  >✕</button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
