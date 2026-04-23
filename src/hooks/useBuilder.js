// =============================================
// NEXUS — useBuilder
// Responsabilidad única: estado de UI del builder.
// No calcula precios, no sabe de productos,
// no tiene lógica de compatibilidad.
// Solo coordina domain + services + estado React.
// =============================================
import { useState, useCallback, useMemo } from 'react'

// Domain
import {
  createBuild,
  setComponent,
  removeComponent,
  setRamSlot,
  setStorageSlot,
  clearBuild as engineClearBuild,
  applyPreset,
} from '../domain/builderEngine'

// Services
import {
  hydrateBuild,
  calculateTotal,
  calculateWattage,
  calculateProgress,
  canCheckout,
  buildToCartItems,
} from '../services/builderService'

// Data (temporal hasta que Spring Boot esté listo)
import { PC_PARTS }             from '../data/products'
import { SLOT_CONFIG, PRESETS } from '../data/slotConfig'
import { checkCompatibility }   from '../data/compatibility'

// Adapters
import { flattenPcParts, createProductsMap } from '../adapters/productsMap'

// ── ProductsMap — lookup O(1) ──────────────────────────────
// Cuando llegue Spring Boot, esto viene de productoService.getProductsMap()
const PRODUCTS_MAP = createProductsMap(flattenPcParts(PC_PARTS))

const REQUIRED_SLOTS = SLOT_CONFIG.filter(s => s.required).map(s => s.id)

export function useBuilder() {
  // ── Estado crudo — solo IDs ──────────────────────────────
  const [build, setBuild]             = useState(() => createBuild())
  const [modalOpen, setModalOpen]     = useState(false)
  const [activeSlot, setActiveSlot]   = useState(null)
  const [activeRamSlot, setActiveRamSlot] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // ── Build hidratado — para la UI ─────────────────────────
  // Se recalcula solo cuando build o PRODUCTS_MAP cambian
  const hydratedBuild = useMemo(
    () => hydrateBuild(build, PRODUCTS_MAP),
    [build]
  )

  // ── Valores derivados ────────────────────────────────────
  const total      = useMemo(() => calculateTotal(build, PRODUCTS_MAP),    [build])
  const wattage    = useMemo(() => calculateWattage(build, PRODUCTS_MAP),  [build])
  const progress   = useMemo(() => calculateProgress(build, REQUIRED_SLOTS), [build])
  const canAddToCart = useMemo(() => canCheckout(build, REQUIRED_SLOTS),   [build])

  const psuWatts   = hydratedBuild?.components?.psu?.potencia || 0
  const wattPct    = psuWatts ? Math.min((wattage / psuWatts) * 100, 100) : 0
  const wattStatus = wattPct > 90 ? 'danger' : wattPct > 70 ? 'warn' : ''

  // Compatibilidad usa el build hidratado para acceder a specs
  const compatibility = useMemo(
    () => checkCompatibility(hydratedBuild?.components || {}),
    [hydratedBuild]
  )

  // ── Acciones del modal ───────────────────────────────────
  const openModal = useCallback((slotId, slotNumber = null) => {
    setActiveSlot(slotId)
    setActiveRamSlot(slotNumber)
    setSearchQuery('')
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setActiveSlot(null)
  }, [])

  // ── Selección de componente ──────────────────────────────
  const selectPart = useCallback((part) => {
    if (!activeSlot) return

    setBuild(prev => {
      // RAM — va a ramSlots
      if (activeSlot === 'ram') {
        const targetSlot = activeRamSlot ?? 1
        return setRamSlot(prev, targetSlot, part.id)
      }
      // Storage — va a storageSlots
      if (activeSlot === 'storage') {
        const slotKey = part.montaje === 'm2' ? 'm2_1' : 'sata_1'
        return setStorageSlot(prev, slotKey, part.id)
      }
      // Slot simple (cpu, gpu, motherboard, psu, cooling)
      return setComponent(prev, activeSlot, part.id)
    })

    closeModal()
  }, [activeSlot, activeRamSlot, closeModal])

  // ── Eliminar componente ──────────────────────────────────
  const removePart = useCallback((slotId, slotNumber = null) => {
    setBuild(prev => {
      if (slotId === 'ram' && slotNumber) {
        return setRamSlot(prev, slotNumber, null)
      }
      return removeComponent(prev, slotId)
    })
  }, [])

  // ── Presets ──────────────────────────────────────────────
  const loadPreset = useCallback((presetKey) => {
    const preset = PRESETS[presetKey]
    if (!preset) return

    setBuild(() => {
      let next = createBuild()

      // Slots simples — sin limpiar dependencias entre ellos
      const slots = {}
      Object.entries(preset).forEach(([slotId, productId]) => {
        if (slotId !== 'ram' && slotId !== 'storage') {
          slots[slotId] = productId
        }
      })
      next = applyPreset(next, slots)

      // RAM
      if (preset.ram) next = setRamSlot(next, 1, preset.ram)

      // Storage
      if (preset.storage) next = setStorageSlot(next, 'm2_1', preset.storage)

      return next
    })
  }, [])

  // ── Limpiar build ────────────────────────────────────────
  const clearBuild = useCallback(() => {
    setBuild(prev => engineClearBuild(prev))
  }, [])

  // ── Agregar al carrito ───────────────────────────────────
  const addToCart = useCallback(() => {
    if (!canAddToCart) return
    const items    = buildToCartItems(hydratedBuild)
    const existing = JSON.parse(localStorage.getItem('nexus_cart') || '[]')
    localStorage.setItem('nexus_cart', JSON.stringify([
      ...existing,
      { type: 'build', items, total, savedAt: new Date().toISOString() }
    ]))
    alert('¡Build agregado al carrito!')
  }, [canAddToCart, hydratedBuild, total])

  // ── Búsqueda en modal ────────────────────────────────────
  const filteredParts = useMemo(() => {
    if (!activeSlot) return []
    const parts = PC_PARTS[activeSlot] || []
    if (!searchQuery) return parts
    const q = searchQuery.toLowerCase()
    return parts.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      (p.marca || '').toLowerCase().includes(q)
    )
  }, [activeSlot, searchQuery])

  return {
    // Estado crudo (para PcScene y lógica interna)
    build,
    // Build hidratado (para UI — tiene objetos completos)
    hydratedBuild,
    // UI state
    modalOpen, activeSlot, searchQuery, setSearchQuery,
    // Acciones
    openModal, closeModal, selectPart, removePart,
    loadPreset, clearBuild, addToCart,
    // Valores derivados
    filteredParts, total, wattage, psuWatts,
    wattPct, wattStatus, progress, canAddToCart, compatibility,
    activeRamSlot,
  }
}
