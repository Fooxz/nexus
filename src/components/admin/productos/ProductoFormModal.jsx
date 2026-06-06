import { CATEGORIAS_PRODUCTO, getCategoriaLabel, getSpecFields } from '../../../data/adminProductFormConfig'

export default function ProductoFormModal({
  modo,
  form,
  errores,
  guardando,
  onChange,
  onCategoriaChange,
  onSpecChange,
  onClose,
  onGuardar,
}) {
  const specFields = getSpecFields(form.categoria)

  function renderSpecField(field) {
    const value = form.specs?.[field.name]
    if (field.type === 'boolean') {
      return (
        <select
          className="admin-field__select"
          value={value === undefined ? '' : String(value)}
          onChange={e => onSpecChange(field.name, e.target.value)}
        >
          <option value="">Seleccionar...</option>
          <option value="true">Si</option>
          <option value="false">No</option>
        </select>
      )
    }

    return (
      <input
        className="admin-field__input"
        type={field.type ?? 'text'}
        placeholder={field.placeholder}
        value={value ?? ''}
        onChange={e => onSpecChange(field.name, e.target.value)}
      />
    )
  }

  return (
    <div className="admin-form-overlay" onClick={onClose}>
      <div className="admin-form-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-form-header">
          <h2 className="admin-form-title">
            {modo === 'crear' ? 'Nuevo producto' : 'Editar producto'}
          </h2>
          <button className="admin-form-close" onClick={onClose}>x</button>
        </div>

        <div className="admin-form-body">
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-field__label">Nombre *</label>
              <input
                className={`admin-field__input ${errores.nombre ? 'error' : ''}`}
                placeholder="Ej: AMD Ryzen 5 5600X"
                value={form.nombre}
                onChange={e => onChange('nombre', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Marca</label>
              <input
                className="admin-field__input"
                placeholder="Ej: AMD, Samsung, Apple..."
                value={form.marca}
                onChange={e => onChange('marca', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-field__label">Categoria *</label>
              <select
                className={`admin-field__select ${errores.categoria ? 'error' : ''}`}
                value={form.categoria}
                onChange={e => onCategoriaChange(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {CATEGORIAS_PRODUCTO.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Precio (COP) *</label>
              <input
                className={`admin-field__input ${errores.precio ? 'error' : ''}`}
                type="number"
                placeholder="Ej: 738000"
                value={form.precio}
                onChange={e => onChange('precio', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-field__label">Precio normal</label>
              <input
                className="admin-field__input"
                type="number"
                placeholder="Precio antes del descuento"
                value={form.precioNormal}
                onChange={e => onChange('precioNormal', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Descuento (%)</label>
              <input
                className="admin-field__input"
                type="number"
                min="0"
                max="99"
                placeholder="Ej: 15"
                value={form.descuento}
                onChange={e => onChange('descuento', e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-field__label">Stock</label>
              <input
                className="admin-field__input"
                type="number"
                placeholder="Ej: 12"
                value={form.stock}
                onChange={e => onChange('stock', e.target.value)}
              />
            </div>
            <div className="admin-field">
              <label className="admin-field__label">Estado</label>
              <select
                className="admin-field__select"
                value={String(form.activo)}
                onChange={e => onChange('activo', e.target.value === 'true')}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-field__label">URL de imagen</label>
            <input
              className="admin-field__input"
              placeholder="https://..."
              value={form.imagen}
              onChange={e => onChange('imagen', e.target.value)}
            />
          </div>

          <div className="admin-field">
            <label className="admin-field__label">Descripcion</label>
            <textarea
              className="admin-field__textarea"
              placeholder="Descripcion breve del producto..."
              value={form.descripcion}
              onChange={e => onChange('descripcion', e.target.value)}
            />
          </div>

          {form.categoria && (
            <section className="admin-spec-section">
              <div className="admin-spec-section__header">
                <h3>Especificaciones tecnicas</h3>
                <span>{getCategoriaLabel(form.categoria)}</span>
              </div>
              <div className="admin-form-row">
                {specFields.map(field => (
                  <div className="admin-field" key={field.name}>
                    <label className="admin-field__label">{field.label}</label>
                    {renderSpecField(field)}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="admin-form-footer">
          <button className="admin-btn-cancel" onClick={onClose}>Cancelar</button>
          <button
            className="admin-btn-save"
            onClick={onGuardar}
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : modo === 'crear' ? 'Crear producto' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
