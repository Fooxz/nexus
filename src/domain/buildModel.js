// =============================================
// NEXUS — BUILD MODEL
// Define la estructura del build. Es el contrato
// entre frontend y backend. Nunca guarda objetos
// completos — solo IDs y metadata de slots.
// =============================================

/**
 * Estructura canónica de un build.
 * Este es el JSON que se enviará al backend.
 *
 * @typedef {Object} Build
 * @property {number} version    - Para migraciones futuras
 * @property {string} caseId     - Key del gabinete en caseConfigs
 * @property {Object} components - Slots del build
 */

export const BUILD_VERSION = 1

/**
 * Slots que solo aceptan UN componente
 */
export const SINGLE_SLOTS = ['cpu', 'motherboard', 'gpu', 'psu', 'cooling']

/**
 * Slots que aceptan MÚLTIPLES componentes
 * Cada entrada tiene { slot, productId }
 */
export const MULTI_SLOTS = ['ramSlots', 'storageSlots']

/**
 * Qué slots se limpian automáticamente cuando cambia otro.
 * Si cambias motherboard → cpu y ram pueden quedar incompatibles.
 */
export const SLOT_DEPENDENCIES = {
  motherboard: ['cpu', 'ramSlots'],
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
      ramSlots:     [],   // [{ slot: 1, productId: "ram-1" }]
      storageSlots: [],   // [{ slot: "m2_1", productId: "sto-1" }]
    },
  }
}
