// =============================================
// NEXUS — useBuilder
// Responsabilidad única: estado de UI del builder.
// =============================================
import { useState, useCallback, useMemo } from 'react'

import {
  createBuild,
  setComponent,
  setCaseId,
  selectCase,
  removeComponent,
  setRamSlot,
  setStorageSlot,
  clearBuild as engineClearBuild,
  applyPreset,
} from '../domain/builderEngine'

import {
  hydrateBuild,
  calculateTotal,
  calculateWattage,
  calculateProgress,
  canCheckout,
  buildToCartItems,
} from '../services/builderService'

import { PC_PARTS }             from '../data/mockComponentesPc'
import { SLOT_CONFIG, PRESETS } from '../data/slotConfig'
import { checkCompatibility }   from '../data/compatibility'
import { flattenPcParts, createProductsMap } from '../adapters/productsMap'

const PRODUCTS_MAP    = createProductsMap(flattenPcParts(PC_PARTS))
const REQUIRED_SLOTS  = SLOT_CONFIG.filter(s => s.required).map(s => s.id)

export function useBuilder() {
  const [build,          setBuild]          = useState(() => createBuild())
  const [modalOpen,      setModalOpen]      = useState(false)
  const [activeSlot,     setActiveSlot]     = useState(null)
  const [activeRamSlot,  setActiveRamSlot]  = useState(null)
  const [searchQuery,    setSearchQuery]    = useState('')

  const hydratedBuild = useMemo(
    () => hydrateBuild(build, PRODUCTS_MAP),
    [build]
  )

  const total        = useMemo(() => calculateTotal(build, PRODUCTS_MAP),      [build])
  const wattage      = useMemo(() => calculateWattage(build, PRODUCTS_MAP),    [build])
  const progress     = useMemo(() => calculateProgress(build, REQUIRED_SLOTS), [build])
  const canAddToCart = useMemo(() => canCheckout(build, REQUIRED_SLOTS),       [build])

  const psuWatts   = hydratedBuild?.components?.psu?.potencia || 0
  const wattPct    = psuWatts ? Math.min((wattage / psuWatts) * 100, 100) : 0
  const wattStatus = wattPct > 90 ? 'danger' : wattPct > 70 ? 'warn' : ''

  const compatibility = useMemo(
    () => checkCompatibility(hydratedBuild?.components || {}),
    [hydratedBuild]
  )

  // ── Modal ──────────────────────────────────────────────
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

  // ── Selección ──────────────────────────────────────────
  const selectPart = useCallback((part) => {
    if (!activeSlot) return
    setBuild(prev => {
      if (activeSlot === 'ram') {
        const targetSlot = activeRamSlot ?? 1
        return setRamSlot(prev, targetSlot, part.id)
      }
      if (activeSlot === 'storage') {
        const slotKey = part.montaje === 'm2' ? 'm2_1' : 'sata_1'
        return setStorageSlot(prev, slotKey, part.id)
      }
      if (activeSlot === 'case') {
        return selectCase(prev, part)
      }
      return setComponent(prev, activeSlot, part.id)
    })
    closeModal()
  }, [activeSlot, activeRamSlot, closeModal])

  // ── Eliminar ───────────────────────────────────────────
  const removePart = useCallback((slotId, slotNumber = null) => {
    setBuild(prev => {
      if (slotId === 'ram' && slotNumber) return setRamSlot(prev, slotNumber, null)
      if (slotId === 'case') {
        const withoutCase = removeComponent(prev, 'case')
        return setCaseId(withoutCase, 'mid-tower')
      }
      return removeComponent(prev, slotId)
    })
  }, [])

  // ── Presets ────────────────────────────────────────────
  const loadPreset = useCallback((presetKey) => {
    const preset = PRESETS[presetKey]
    if (!preset) return
    setBuild(() => {
      let next = createBuild()
      const slots = {}
      Object.entries(preset).forEach(([slotId, productId]) => {
        if (slotId !== 'ram' && slotId !== 'storage' && slotId !== 'case') slots[slotId] = productId
      })
      next = applyPreset(next, slots)
      if (preset.ram)     next = setRamSlot(next, 1, preset.ram)
      if (preset.storage) next = setStorageSlot(next, 'm2_1', preset.storage)
      if (preset.case) {
        const caseProduct = PRODUCTS_MAP[preset.case]
        next = selectCase(next, caseProduct)
      }
      return next
    })
  }, [])

  // ── Limpiar ────────────────────────────────────────────
  const clearBuild = useCallback(() => {
    setBuild(prev => engineClearBuild(prev))
  }, [])

  // ── buildToCartItems expuesto para que PcBuilder lo use ─
  const getCartItems = useCallback(() => {
    return buildToCartItems(hydratedBuild)
  }, [hydratedBuild])

  // ── Búsqueda ───────────────────────────────────────────
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
    build,
    hydratedBuild,
    modalOpen, activeSlot, searchQuery, setSearchQuery,
    openModal, closeModal, selectPart, removePart,
    loadPreset, clearBuild,
    getCartItems,
    filteredParts, total, wattage, psuWatts,
    wattPct, wattStatus, progress, canAddToCart, compatibility,
    activeRamSlot,
  }
}