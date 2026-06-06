// =============================================
// NEXUS — PC PARTS SERVICE
// Carga todos los componentes PC desde Spring Boot.
// Los DTOs ya devuelven datos aplanados (imagen en raíz).
// =============================================
import API_BASE_URL from '../config/api'
import { enrichWithMeta } from '../data/pcPartsMeta'

const BASE = API_BASE_URL

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Error fetching ${path}: ${res.status}`)
  return res.json()
}

function normalizePart(item) {
  return enrichWithMeta(item)
}

function normalizeParts(items) {
  if (!Array.isArray(items)) return []
  return items.map(normalizePart)
}

/**
 * Carga todos los componentes PC del backend y los organiza
 * en el mismo shape que usaba PC_PARTS del mock:
 * { cpu: [...], gpu: [...], ram: [...], ... }
 *
 * Cada item ya viene aplanado del DTO:
 * { id, nombre, precio, marca, imagen, socket, nucleos, ... }
 */
export async function loadPcParts() {
  const [cpus, gpus, rams, motherboards, storages, psus, cases, coolings] =
    await Promise.all([
      get('/cpus'),
      get('/gpus'),
      get('/rams'),
      get('/motherboards'),
      get('/storages'),
      get('/psus'),
      get('/cases'),
      get('/coolings'),
    ])

  return {
    cpu:         normalizeParts(cpus),
    gpu:         normalizeParts(gpus),
    ram:         normalizeParts(rams),
    motherboard: normalizeParts(motherboards),
    storage:     normalizeParts(storages),
    psu:         normalizeParts(psus),
    case:        normalizeParts(cases),
    cooling:     normalizeParts(coolings),
  }
}