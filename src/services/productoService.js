// =============================================
// NEXUS — PRODUCTO SERVICE
// USE_MOCK = true  → mockComponentesPc.js
// USE_MOCK = false → Spring Boot
// =============================================
import { PC_PARTS }                          from '../data/mockComponentesPc'  // ← corregido
import { flattenPcParts, createProductsMap } from '../adapters/productsMap'

const USE_MOCK = true
const API_BASE = 'http://localhost:8080/api'

const ALL_PRODUCTS = flattenPcParts(PC_PARTS)
const PRODUCTS_MAP = createProductsMap(ALL_PRODUCTS)

export async function getByCategoria(categoria) {
  if (USE_MOCK) return PC_PARTS[categoria] ?? []
  const res = await fetch(`${API_BASE}/productos?categoria=${categoria}`)
  if (!res.ok) throw new Error(`Error fetching categoria: ${categoria}`)
  return res.json()
}

export async function getById(id) {
  if (USE_MOCK) return PRODUCTS_MAP[id] ?? null
  const res = await fetch(`${API_BASE}/productos/${id}`)
  if (!res.ok) return null
  return res.json()
}

export async function getProductsMap() {
  if (USE_MOCK) return PRODUCTS_MAP
  const res = await fetch(`${API_BASE}/productos`)
  if (!res.ok) throw new Error('Error fetching products')
  const data = await res.json()
  return createProductsMap(data)
}

export async function getAll() {
  if (USE_MOCK) return ALL_PRODUCTS
  const res = await fetch(`${API_BASE}/productos`)
  if (!res.ok) throw new Error('Error fetching products')
  return res.json()
}