// =============================================
// NEXUS — useBuilder
// Responsabilidad única: estado de UI del builder.
// Carga componentes desde Spring Boot (no mock).
// =============================================
import { useState, useCallback, useMemo, useEffect } from 'react'

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

import { loadPcParts } from '../services/pcPartsService'
import { SLOT_CONFIG, PRESETS } from '../data/slotConfig'
import { checkCompatibility } from '../data/compatibility'
import { flattenPcParts, createProductsMap } from '../adapters/productsMap'

const REQUIRED_SLOTS = SLOT_CONFIG.filter(s => s.required).map(s => s.id)

function getStorageSlotKey(part) {
  if (!part) return 'sata_1'
  return part.montaje === 'm2' || part.tipo === 'NVMe'
    ? 'm2_1'
    : 'sata_1'
}

function inferCaseConfigId(caseId) {
  if (caseId === 'case-gamer') return 'case-gamer'
  if (caseId === 'case-pro') return 'case-pro'
  return 'mid-tower'
}

export function useBuilder() {
  const [build, setBuild] = useState(() => createBuild())
  const [modalOpen, setModalOpen] = useState(false)
  const [activeSlot, setActiveSlot] = useState(null)
  const [activeRamSlot, setActiveRamSlot] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const [pcParts, setPcParts] = useState({})
  const [productsMap, setProductsMap] = useState({})
  const [partsLoading, setPartsLoading] = useState(true)
  const [partsError, setPartsError] = useState(null)

  useEffect(() => {
    loadPcParts()
      .then(parts => {
        setPcParts(parts)
        setProductsMap(createProductsMap(flattenPcParts(parts)))
      })
      .catch(e => {
        console.error('Error cargando componentes PC:', e)
        setPartsError(e.message || 'Error cargando componentes')
      })
      .finally(() => setPartsLoading(false))
  }, [])

  const hydratedBuild = useMemo(
    () => hydrateBuild(build, productsMap),
    [build, productsMap]
  )

  const total = useMemo(
    () => calculateTotal(build, productsMap),
    [build, productsMap]
  )

  const wattage = useMemo(
    () => calculateWattage(build, productsMap),
    [build, productsMap]
  )

  const progress = useMemo(
    () => calculateProgress(build, REQUIRED_SLOTS),
    [build]
  )

  const canAddToCart = useMemo(
    () => canCheckout(build, REQUIRED_SLOTS),
    [build]
  )

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
        const slotKey = getStorageSlotKey(part)
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
        if (slotId !== 'ram' && slotId !== 'storage' && slotId !== 'case') {
          const part = Object.values(productsMap).find(p => p.modelKey === productId)
          if (part) slots[slotId] = part.id
        }
      })
      next = applyPreset(next, slots)
      if (preset.ram) {
        const ramPart = Object.values(productsMap).find(p => p.modelKey === preset.ram)
        if (ramPart) next = setRamSlot(next, 1, ramPart.id)
      }

      if (preset.storage) {
        const storagePart = Object.values(productsMap).find(p => p.modelKey === preset.storage)
        const storageSlot = getStorageSlotKey(storagePart)
        next = setStorageSlot(next, storageSlot, storagePart?.id ?? preset.storage)
      }

      if (preset.case) {
        const caseProduct = Object.values(productsMap).find(p => p.modelKey === preset.case)
        if (caseProduct) {
          next = selectCase(next, caseProduct)
        } else {
          next = setComponent(next, 'case', preset.case)
          next = setCaseId(next, inferCaseConfigId(preset.case))
        }
      }

      return next
    })
  }, [productsMap])

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
    const parts = pcParts[activeSlot] || []
    if (!searchQuery) return parts
    const q = searchQuery.toLowerCase()
    return parts.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      (p.marca || '').toLowerCase().includes(q)
    )
  }, [activeSlot, searchQuery, pcParts])

  return {
    build,
    hydratedBuild,
    modalOpen,
    activeSlot,
    searchQuery,
    setSearchQuery,
    openModal,
    closeModal,
    selectPart,
    removePart,
    loadPreset,
    clearBuild,
    getCartItems,
    filteredParts,
    total,
    wattage,
    psuWatts,
    wattPct,
    wattStatus,
    progress,
    canAddToCart,
    compatibility,
    activeRamSlot,
    partsLoading,
    partsError,
  }
}