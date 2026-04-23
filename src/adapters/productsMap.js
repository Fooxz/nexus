// =============================================
// NEXUS — PRODUCTS MAP ADAPTER
// Responsabilidad única: convertir un array de
// productos en un mapa para lookup O(1).
// Vive en adapters/ porque transforma datos
// externos — no es lógica de dominio.
// =============================================

/**
 * Convierte un array de productos en un mapa id → producto.
 * Compatible con datos mock y con respuesta real del backend.
 *
 * @param {Array} productsArray - Array plano de productos
 * @returns {Object} mapa { "cpu-1": {...}, "gpu-1": {...} }
 */
export function createProductsMap(productsArray) {
  return Object.fromEntries(
    productsArray.map(p => [p.id, p])
  )
}

/**
 * Convierte PC_PARTS (objeto por categoría) en array plano.
 * Solo necesario mientras usemos el mock — con la API
 * el backend devolverá un array directamente.
 *
 * @param {Object} pcParts - { cpu: [...], gpu: [...], ... }
 * @returns {Array} array plano de todos los productos
 */
export function flattenPcParts(pcParts) {
  return Object.values(pcParts).flat()
}

/**
 * Obtiene un producto por ID del mapa.
 * Retorna null si no existe — nunca rompe.
 */
export function getProduct(productsMap, productId) {
  if (!productId) return null
  return productsMap[productId] ?? null
}
