// =============================================
// NEXUS — BUILDER SERVICE
// Responsabilidad única: puente entre el dominio
// puro, los datos de productos y la UI.
// Aquí vive la hidratación, cálculos y persistencia.
// =============================================

import { getProduct } from '../adapters/productsMap'

/**
 * Convierte un build de IDs a objetos completos para la UI.
 * Es una función de lectura pura — NO modifica el build.
 *
 * @param {Object} build       - Build con IDs (del engine)
 * @param {Object} productsMap - Mapa id → producto
 * @returns {Object} build hidratado para consumo de la UI
 */
export function hydrateBuild(build, productsMap) {
  if (!build?.components) return null

  const { components } = build

  return {
    ...build,
    components: {
      cpu:         getProduct(productsMap, components.cpu),
      motherboard: getProduct(productsMap, components.motherboard),
      gpu:         getProduct(productsMap, components.gpu),
      psu:         getProduct(productsMap, components.psu),
      cooling:     getProduct(productsMap, components.cooling),

      // RAM: array de { slot, product }
      ramSlots: (components.ramSlots || []).map(r => ({
        slot:    r.slot,
        product: getProduct(productsMap, r.productId),
      })),

      // Storage: array de { slot, product }
      storageSlots: (components.storageSlots || []).map(s => ({
        slot:    s.slot,
        product: getProduct(productsMap, s.productId),
      })),
    },
  }
}

/**
 * Calcula el precio total del build.
 * Trabaja con el build crudo (IDs) + productsMap.
 */
export function calculateTotal(build, productsMap) {
  if (!build?.components) return 0
  const { components } = build

  const singleTotal = ['cpu', 'motherboard', 'gpu', 'psu', 'cooling']
    .reduce((sum, slot) => {
      const product = getProduct(productsMap, components[slot])
      return sum + (product?.precio || 0)
    }, 0)

  const ramTotal = (components.ramSlots || [])
    .reduce((sum, r) => {
      const product = getProduct(productsMap, r.productId)
      return sum + (product?.precio || 0)
    }, 0)

  const storageTotal = (components.storageSlots || [])
    .reduce((sum, s) => {
      const product = getProduct(productsMap, s.productId)
      return sum + (product?.precio || 0)
    }, 0)

  return singleTotal + ramTotal + storageTotal
}

/**
 * Calcula el wattaje estimado del sistema.
 * Más preciso que antes — suma todos los componentes.
 */
export function calculateWattage(build, productsMap) {
  if (!build?.components) return 0
  const { components } = build

  const cpuTdp    = getProduct(productsMap, components.cpu)?.tdp      || 0
  const gpuWatts  = getProduct(productsMap, components.gpu)?.potencia  || 0
  const baseWatts = 75 // motherboard + RAM + storage estimado

  return cpuTdp + gpuWatts + baseWatts
}

/**
 * Calcula el progreso del build (slots requeridos completados).
 */
export function calculateProgress(build, requiredSlots) {
  if (!build?.components) return 0
  const { components } = build

  const filled = requiredSlots.filter(slotId => {
    if (slotId === 'ram')     return (components.ramSlots || []).length > 0
    if (slotId === 'storage') return (components.storageSlots || []).length > 0
    return components[slotId] !== null
  })

  return Math.round((filled.length / requiredSlots.length) * 100)
}

/**
 * Verifica si el build puede agregarse al carrito.
 */
export function canCheckout(build, requiredSlots) {
  return calculateProgress(build, requiredSlots) === 100
}

/**
 * Serializa el build para enviar al backend o guardar en localStorage.
 */
export function exportBuild(build) {
  return {
    version:    build.version,
    caseId:     build.caseId,
    components: build.components,
    exportedAt: new Date().toISOString(),
  }
}

/**
 * Convierte el build hidratado en items de carrito.
 * Cada item tiene { productId, nombre, precio }.
 */
export function buildToCartItems(hydratedBuild) {
  if (!hydratedBuild?.components) return []
  const { components } = hydratedBuild
  const items = []

  ;['cpu', 'motherboard', 'gpu', 'psu', 'cooling'].forEach(slot => {
    if (components[slot]) {
      items.push({
        productId: components[slot].id,
        nombre:    components[slot].nombre,
        precio:    components[slot].precio,
      })
    }
  })

  ;(components.ramSlots || []).forEach(r => {
    if (r.product) {
      items.push({
        productId: r.product.id,
        nombre:    r.product.nombre,
        precio:    r.product.precio,
        slot:      `RAM slot ${r.slot}`,
      })
    }
  })

  ;(components.storageSlots || []).forEach(s => {
    if (s.product) {
      items.push({
        productId: s.product.id,
        nombre:    s.product.nombre,
        precio:    s.product.precio,
        slot:      `Storage slot ${s.slot}`,
      })
    }
  })

  return items
}
