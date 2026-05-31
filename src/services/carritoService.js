// =============================================
// NEXUS — carritoService
// USE_MOCK = true  → solo retorna éxito simulado
// USE_MOCK = false → POST a Spring Boot
// =============================================

const USE_MOCK = true
const API_BASE = 'http://localhost:8080/api'

/**
 * Envía el pedido al backend.
 * @param {Array}  items  — ítems del carrito [{ id, nombre, precio, cantidad }]
 * @param {string} token  — JWT del usuario autenticado
 * @returns {Promise<{ pedidoId: string, total: number, estado: string }>}
 */
export async function confirmarPedido(items, token) {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 900))
    return {
      pedidoId: `PED-${Date.now()}`,
      total:    items.reduce((acc, i) => acc + i.precio * i.cantidad, 0),
      estado:   'CONFIRMADO',
    }
  }

  const res = await fetch(`${API_BASE}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: items.map(i => ({
        productoId: i.id,
        cantidad:   i.cantidad,
        precioUnit: i.precio,
      })),
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message ?? `Error ${res.status} al confirmar pedido`)
  }

  return res.json()
}
