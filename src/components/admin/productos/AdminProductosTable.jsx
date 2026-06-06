import { getCategoriaLabel } from '../../../data/adminProductFormConfig'
import { formatCOP } from '../../../utils/adminProductForm'

export default function AdminProductosTable({ productos, onEditar, onEliminar }) {
  return (
    <div className="admin-prod-table-wrap">
      <table className="admin-prod-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Categoria</th>
            <th>Precio</th>
            <th>Descuento</th>
            <th>Stock</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>
                <img
                  className="admin-prod-table__img"
                  src={producto.imagen}
                  alt={producto.nombre}
                  onError={e => { e.target.style.opacity = '.2' }}
                />
              </td>
              <td><span className="admin-prod-table__name">{producto.nombre}</span></td>
              <td>{producto.marca ?? '-'}</td>
              <td>
                <span className="admin-badge admin-badge--muted">
                  {getCategoriaLabel(producto.categoria)}
                </span>
              </td>
              <td style={{ color: 'var(--accent)', fontWeight: 700 }}>
                {formatCOP(producto.precio)}
              </td>
              <td>
                {producto.descuento > 0
                  ? <span className="admin-badge admin-badge--danger">-{producto.descuento}%</span>
                  : <span className="muted">-</span>
                }
              </td>
              <td>{producto.stock ?? 0}</td>
              <td>
                <div className="admin-prod-table__actions">
                  <button className="admin-btn-edit" onClick={() => onEditar(producto)}>
                    Editar
                  </button>
                  <button className="admin-btn-delete" onClick={() => onEliminar(producto.id)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
