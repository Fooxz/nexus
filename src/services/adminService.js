// =============================================
// NEXUS — ADMIN SERVICE
// USE_MOCK = false → Spring Boot
// =============================================
import API_BASE_URL from '../config/api'

const API_BASE = `${API_BASE_URL}/admin`

function getToken() {
  return localStorage.getItem('nexus_token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

async function handleResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => `Error ${res.status}`)
    throw new Error(msg || `Error ${res.status}`)
  }
  // 204 No Content no tiene body
  if (res.status === 204) return { ok: true }
  return res.json()
}

/* ══════════════════════════════════════════
   STATS
══════════════════════════════════════════ */

export async function getStats() {
  const res = await fetch(`${API_BASE}/stats`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

/* ══════════════════════════════════════════
   PRODUCTOS
══════════════════════════════════════════ */

export async function getProductosAdmin() {
  const res = await fetch(`${API_BASE}/productos`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

export async function crearProducto(datos) {
  const res = await fetch(`${API_BASE}/productos`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(datos),
  })
  return handleResponse(res)
}

export async function actualizarProducto(id, datos) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(datos),
  })
  return handleResponse(res)
}

export async function eliminarProducto(id) {
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(res)
}

/* ══════════════════════════════════════════
   PEDIDOS
══════════════════════════════════════════ */

export async function getPedidos() {
  const res = await fetch(`${API_BASE}/pedidos`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}

// Eliminar pedido
export async function eliminarPedido(id) {
  const res = await fetch(`${API_BASE}/pedidos/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Error al eliminar pedido')
  return { ok: true }
}
/* ══════════════════════════════════════════
   USUARIOS
══════════════════════════════════════════ */

export async function getUsuarios() {
  const res = await fetch(`${API_BASE}/usuarios`, {
    headers: authHeaders(),
  })
  return handleResponse(res)
}