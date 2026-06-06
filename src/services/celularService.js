// =============================================
// NEXUS — CELULAR SERVICE
// USE_MOCK = true  → mockCelulares.js
// USE_MOCK = false → Spring Boot
// =============================================
import { CELULARES } from '../data/mockCelulares'  // ← corregido
import API_BASE_URL from '../config/api'

const USE_MOCK = false
const API_BASE = API_BASE_URL

export async function getCelulares() {
  if (USE_MOCK) return CELULARES
  const res = await fetch(`${API_BASE}/celulares`)
  if (!res.ok) throw new Error('Error cargando celulares')
  return res.json()
}

export async function buscarCelulares(query) {
  const todos = await getCelulares()
  if (!query) return todos
  const q = query.toLowerCase()
  return todos.filter(c =>
    c.marca.toLowerCase().includes(q) ||
    c.modelo.toLowerCase().includes(q)
  )
}