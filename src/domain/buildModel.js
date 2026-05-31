// =============================================
// NEXUS — BUILD MODEL
// Define la estructura del build. Es el contrato
// entre frontend y backend. Nunca guarda objetos
// completos — solo IDs y metadata de slots.
// =============================================

export const BUILD_VERSION = 1

/**
 * Slots que solo aceptan UN componente.
 * 'case' se agrega aquí para que setComponent
 * lo acepte y lo guarde correctamente.
 */
export const SINGLE_SLOTS = ['cpu', 'motherboard', 'gpu', 'psu', 'cooling', 'case']

/**
 * Slots que aceptan MÚLTIPLES componentes
 */
export const MULTI_SLOTS = ['ramSlots', 'storageSlots']

/**
 * Qué slots se limpian automáticamente cuando cambia otro.
 */
export const SLOT_DEPENDENCIES = {
  motherboard: ['cpu', 'ramSlots'],
}

/**
 * Mapeo de slots múltiples a sus propiedades en components.
 * Usado en calculateProgress para saber cuáles son slots múltiples.
 */
export const MULTI_SLOT_KEYS = {
  ram:     'ramSlots',
  storage: 'storageSlots',
}

/**
 * Crea un build vacío con la estructura correcta.
 */
export function createEmptyBuild(caseId = 'mid-tower') {
  return {
    version:    BUILD_VERSION,
    caseId,
    components: {
      cpu:          null,
      motherboard:  null,
      gpu:          null,
      psu:          null,
      cooling:      null,
      case:         null,
      ramSlots:     [],   // [{ slot: 1, productId: "ram-1" }]
      storageSlots: [],   // [{ slot: "m2_1", productId: "sto-1" }]
    },
  }
}