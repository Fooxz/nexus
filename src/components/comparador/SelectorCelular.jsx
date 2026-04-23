// =============================================
// NEXUS — SelectorCelular
// Responsabilidad única: UI del selector de productos.
// Recibe lista filtrada y dispara onSelect.
// =============================================

export default function SelectorCelular({
  open, slot, productos, busqueda, filtroMarca, marcas,
  onBusqueda, onMarca, onSelect, onClose,
}) {
  if (!open) return null

  return (
    <div className="sel-overlay" onClick={onClose}>
      <div className="sel-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="sel-header">
          <p className="sel-title">
            Elige el celular <span>{slot === 'a' ? 'A' : 'B'}</span>
          </p>
          <button className="sel-close" onClick={onClose}>✕</button>
        </div>

        {/* Búsqueda */}
        <div className="sel-search">
          <input
            autoFocus
            type="text"
            placeholder="Buscar modelo o marca..."
            value={busqueda}
            onChange={e => onBusqueda(e.target.value)}
            className="sel-input"
          />
        </div>

        {/* Filtro marcas */}
        <div className="sel-marcas">
          {marcas.map(m => (
            <button
              key={m}
              className={`sel-marca-pill ${filtroMarca === m ? 'active' : ''}`}
              onClick={() => onMarca(m)}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Lista */}
        <div className="sel-list">
          {productos.length === 0 && (
            <p className="sel-empty">Sin resultados.</p>
          )}
          {productos.map(p => (
            <button
              key={p.id}
              className="sel-item"
              onClick={() => onSelect(p)}
            >
              <img
                src={p.imagen}
                alt={p.modelo}
                className="sel-item-img"
                onError={e => { e.target.style.display = 'none' }}
              />
              <div className="sel-item-info">
                <p className="sel-item-marca">{p.marca}</p>
                <p className="sel-item-modelo">{p.modelo} · {p.storage}</p>
                <p className="sel-item-color">{p.color}</p>
              </div>
              <p className="sel-item-precio">
                ${p.precio.toLocaleString('es-CO')}
              </p>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
