import { CATEGORIAS_PRODUCTO } from '../../../data/adminProductFormConfig'

export default function AdminProductosToolbar({
  busqueda,
  catFiltro,
  onBusquedaChange,
  onCategoriaChange,
  onNuevo,
}) {
  return (
    <div className="admin-prod-toolbar">
      <div className="admin-prod-search">
        <svg className="admin-prod-search__icon" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          className="admin-prod-search__input"
          placeholder="Buscar por nombre o marca..."
          value={busqueda}
          onChange={e => onBusquedaChange(e.target.value)}
        />
      </div>

      <select
        className="admin-filter-select"
        value={catFiltro}
        onChange={e => onCategoriaChange(e.target.value)}
      >
        <option value="Todas">Todas las categorias</option>
        {CATEGORIAS_PRODUCTO.map(c => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <button className="admin-btn-new" onClick={onNuevo}>
        + Nuevo producto
      </button>
    </div>
  )
}
