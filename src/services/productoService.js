// =============================================
// NEXUS — PRODUCTO SERVICE
// Responsabilidad única: acceso a datos de productos.
// Hoy usa mock — cuando Spring Boot esté listo,
// solo cambia USE_MOCK = false y nada más se toca.
// =============================================

import { PC_PARTS }                       from '../data/products'
import { flattenPcParts, createProductsMap } from '../adapters/productsMap'

const USE_MOCK = true
const API_BASE = '/api'

// ── Mock ──────────────────────────────────────────────────

const ALL_PRODUCTS  = flattenPcParts(PC_PARTS)
const PRODUCTS_MAP  = createProductsMap(ALL_PRODUCTS)

// ── Service ───────────────────────────────────────────────

/**
 * Obtiene productos por categoría.
 * @param {string} categoria - "cpu" | "gpu" | "ram" | ...
 */
export async function getByCategoria(categoria) {
  if (USE_MOCK) return PC_PARTS[categoria] ?? []
  const res = await fetch(`${API_BASE}/productos?categoria=${categoria}`)
  if (!res.ok) throw new Error(`Error fetching categoria: ${categoria}`)
  return res.json()
}

/**
 * Obtiene un producto por ID.
 */
export async function getById(id) {
  if (USE_MOCK) return PRODUCTS_MAP[id] ?? null
  const res = await fetch(`${API_BASE}/productos/${id}`)
  if (!res.ok) return null
  return res.json()
}

/**
 * Obtiene todos los productos como mapa id → producto.
 * Usado por builderService para hidratación O(1).
 */
export async function getProductsMap() {
  if (USE_MOCK) return PRODUCTS_MAP
  const res  = await fetch(`${API_BASE}/productos`)
  if (!res.ok) throw new Error('Error fetching products')
  const data = await res.json()
  return createProductsMap(data)
}

/**
 * Obtiene todos los productos como array plano.
 */
export async function getAll() {
  if (USE_MOCK) return ALL_PRODUCTS
  const res = await fetch(`${API_BASE}/productos`)
  if (!res.ok) throw new Error('Error fetching products')
  return res.json()
}
