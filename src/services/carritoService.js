// =============================================
// NEXUS — CARRITO SERVICE
// Confirma pedidos contra Spring Boot.
// POST /api/pedidos  (requiere JWT)
// =============================================
import API_BASE_URL from '../config/api'
import { getToken } from './authService'

const API_BASE = `${API_BASE_URL}`

/**
 * Confirma el pedido en el backend.
 *
 * @param {Array}  items           — ítems del carrito
 *   [{ id, productoId, nombre, precio, cantidad }]
 * @param {string} token           — JWT del usuario autenticado
 * @param {string} nombreComprador — nombre ingresado en el checkout
 *
 * @returns {Promise<{ pedidoId, total, estado, createdAt }>}
 */
export async function confirmarPedido(items, token, nombreComprador = '') {
  const jwt = token ?? getToken()
  if (!jwt) {
    throw new Error('Usuario no autenticado. Por favor inicia sesión para completar la compra.')
  }

  const body = {
    nombreComprador,
    items: items.map(i => ({
      productoId:     i.productoId ?? i.id,
      cantidad:       i.cantidad ?? 1,
      precioUnitario: i.precio,
    })),
  }

  const res = await fetch(`${API_BASE}/pedidos`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      Authorization:   `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => '')
    throw new Error(err || `Error ${res.status} al confirmar pedido`)
  }

  const data = await res.json()

  // El back devuelve { pedidoId, total, estado, createdAt }
  return {
    pedidoId: data.pedidoId,
    total:    data.total,
    estado:   data.estado ?? 'CONFIRMADO',
  }
}