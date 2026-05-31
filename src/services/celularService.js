// =============================================
// NEXUS — CELULAR SERVICE
// USE_MOCK = true  → mockCelulares.js
// USE_MOCK = false → Spring Boot
// =============================================
import { CELULARES } from '../data/mockCelulares'  // ← corregido

const USE_MOCK = false
const API_BASE = 'http://localhost:8080/api'

export async function getCelulares() {
  if (USE_MOCK) return CELULARES
  const res = await fetch(`${API_BASE}/productos?categoria=celular`)
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