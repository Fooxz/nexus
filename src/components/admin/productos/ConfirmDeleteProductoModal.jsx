export default function ConfirmDeleteProductoModal({ onClose, onConfirm }) {
  return (
    <div className="admin-form-overlay" onClick={onClose}>
      <div
        className="admin-form-modal"
        style={{ maxWidth: 380 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="admin-form-header">
          <h2 className="admin-form-title">Confirmar eliminacion</h2>
          <button className="admin-form-close" onClick={onClose}>x</button>
        </div>
        <div className="admin-form-body">
          <p className="admin-delete-text">
            Esta accion no se puede deshacer. Eliminar este producto?
          </p>
        </div>
        <div className="admin-form-footer">
          <button className="admin-btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="admin-btn-danger" onClick={onConfirm}>
            Si, eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
