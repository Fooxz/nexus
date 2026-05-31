// =============================================
// NEXUS — BUILDER SERVICE
// =============================================

import { getProduct } from '../adapters/productsMap'
import { MULTI_SLOT_KEYS } from '../domain/buildModel'

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
      case:        getProduct(productsMap, components.case),
      ramSlots: (components.ramSlots || []).map(r => ({
        slot:    r.slot,
        product: getProduct(productsMap, r.productId),
      })),
      storageSlots: (components.storageSlots || []).map(s => ({
        slot:    s.slot,
        product: getProduct(productsMap, s.productId),
      })),
    },
  }
}

export function calculateTotal(build, productsMap) {
  if (!build?.components) return 0
  const { components } = build

  // Incluye case en el total — puede tener precio
  const singleTotal = ['cpu', 'motherboard', 'gpu', 'psu', 'cooling', 'case']
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

export function calculateWattage(build, productsMap) {
  if (!build?.components) return 0
  const { components } = build
  const cpuTdp    = getProduct(productsMap, components.cpu)?.tdp     || 0
  const gpuWatts  = getProduct(productsMap, components.gpu)?.potencia || 0
  const baseWatts = 75
  return cpuTdp + gpuWatts + baseWatts
}

export function calculateProgress(build, requiredSlots) {
  if (!build?.components) return 0
  const { components } = build
  const filled = requiredSlots.filter(slotId => {
    const multiSlotKey = MULTI_SLOT_KEYS[slotId]
    if (multiSlotKey) return (components[multiSlotKey] || []).length > 0
    return components[slotId] !== null
  })
  return Math.round((filled.length / requiredSlots.length) * 100)
}

export function canCheckout(build, requiredSlots) {
  return calculateProgress(build, requiredSlots) === 100
}

export function exportBuild(build) {
  return {
    version:    build.version,
    caseId:     build.caseId,
    components: build.components,
    exportedAt: new Date().toISOString(),
  }
}

export function buildToCartItems(hydratedBuild) {
  if (!hydratedBuild?.components) return []
  const { components } = hydratedBuild
  const items = []

  const pushItem = (product, slotLabel) => {
    if (!product) return
    items.push({
      productId: product.id,
      id:        product.id,
      nombre:    product.nombre,
      marca:     product.marca  ?? '',
      precio:    product.precio,
      imagen:    product.imagen ?? '',
      categoria: slotLabel,
    })
  }

  pushItem(components.cpu,         'CPU')
  pushItem(components.motherboard, 'Motherboard')
  pushItem(components.gpu,         'GPU')
  pushItem(components.psu,         'Fuente')
  pushItem(components.cooling,     'Refrigeración')
  pushItem(components.case,        'Gabinete')

  ;(components.ramSlots || []).forEach(r =>
    pushItem(r.product, `RAM slot ${r.slot}`)
  )
  ;(components.storageSlots || []).forEach(s =>
    pushItem(s.product, `Storage slot ${s.slot}`)
  )

  return items
}