import { SLOT_CONFIG } from '../../data/slotConfig'

export default function BuilderModal({ open, activeSlot, parts, query, onSearch, onSelect, onClose }) {
  const slotLabel = SLOT_CONFIG.find(s => s.id === activeSlot)?.label || ''

  return (
    <div className={`part-modal-overlay${open ? ' open' : ''}`} onClick={onClose}>
      <div className="part-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Seleccionar {slotLabel}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-search">
          <input
            type="text"
            placeholder="Buscar por nombre, marca..."
            value={query}
            onChange={e => onSearch(e.target.value)}
            autoFocus
          />
        </div>
        <div className="modal-list">
          {parts.map(part => (
            <div key={part.id} className="part-option" onClick={() => onSelect(part)}>
              <div className="part-option-icon">
                {part.imagen
                  ? <img src={part.imagen} alt={part.nombre} style={{width:'100%',height:'100%',objectFit:'contain'}} onError={e => e.target.style.display='none'}/>
                  : '📦'}
              </div>
              <div className="part-option-info">
                <div className="part-option-name">{part.nombre}</div>
                <div className="part-option-spec">
                  {part.socket && `Socket: ${part.socket}`}
                  {part.velocidad && ` · ${part.velocidad}`}
                  {part.vram && `VRAM: ${part.vram}`}
                  {part.capacidad && `${part.capacidad}`}
                  {part.tipo && ` · ${part.tipo}`}
                  {part.potencia && `${part.potencia}W`}
                  {part.certificacion && ` · ${part.certificacion}`}
                </div>
              </div>
              <div className="part-option-price">${part.precio}</div>
            </div>
          ))}
          {parts.length === 0 && (
            <p style={{color:'var(--text-muted)',fontFamily:'var(--font-mono)',fontSize:'.8rem',padding:'1rem'}}>
              No se encontraron resultados.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
