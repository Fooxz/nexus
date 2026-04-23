// =============================================
// NEXUS — useComparador
// Responsabilidad única: estado de UI del comparador.
// Coordina servicios + estado React.
// No calcula nada — eso es trabajo del service.
// =============================================
import { useState, useMemo, useCallback } from 'react'
import { CELULARES } from '../celularesprueba/celulares'
import {
  calcularScoresRadar,
  calcularVentajas,
  calcularScoreGlobal,
} from '../services/comparadorService'

export function useComparador() {
  const [selA, setSelA]             = useState(null)   // producto A seleccionado
  const [selB, setSelB]             = useState(null)   // producto B seleccionado
  const [modalSlot, setModalSlot]   = useState(null)   // 'a' | 'b' | null
  const [busqueda, setBusqueda]     = useState('')
  const [filtroMarca, setFiltroMarca] = useState('Todas')

  // ── Marcas disponibles ──────────────────────────────────
  const marcas = useMemo(() => {
    const set = new Set(CELULARES.map(c => c.marca))
    return ['Todas', ...Array.from(set).sort()]
  }, [])

  // ── Productos filtrados para el modal ───────────────────
  const productosFiltrados = useMemo(() => {
    return CELULARES.filter(c => {
      const matchMarca   = filtroMarca === 'Todas' || c.marca === filtroMarca
      const q            = busqueda.toLowerCase()
      const matchBusqueda = !q ||
        c.modelo.toLowerCase().includes(q) ||
        c.marca.toLowerCase().includes(q)
      // Excluir el que ya está en el otro slot
      const otroSlot = modalSlot === 'a' ? selB : selA
      const noEsMismo = !otroSlot || otroSlot.id !== c.id
      return matchMarca && matchBusqueda && noEsMismo
    })
  }, [busqueda, filtroMarca, modalSlot, selA, selB])

  // ── Datos derivados para la UI (solo cuando hay 2) ──────
  const comparacion = useMemo(() => {
    if (!selA || !selB) return null
    return {
      scores:      calcularScoresRadar(selA, selB),
      ventajas:    calcularVentajas(selA, selB),
      scoreGlobalA: calcularScoreGlobal(selA, selB),
      scoreGlobalB: calcularScoreGlobal(selB, selA),
    }
  }, [selA, selB])

  // ── Acciones ────────────────────────────────────────────
  const abrirModal = useCallback((slot) => {
    setModalSlot(slot)
    setBusqueda('')
    setFiltroMarca('Todas')
  }, [])

  const cerrarModal = useCallback(() => {
    setModalSlot(null)
  }, [])

  const seleccionar = useCallback((producto) => {
    if (modalSlot === 'a') setSelA(producto)
    if (modalSlot === 'b') setSelB(producto)
    cerrarModal()
  }, [modalSlot, cerrarModal])

  const limpiarSlot = useCallback((slot) => {
    if (slot === 'a') setSelA(null)
    if (slot === 'b') setSelB(null)
  }, [])

  const intercambiar = useCallback(() => {
    setSelA(selB)
    setSelB(selA)
  }, [selA, selB])

  return {
    // Estado
    selA, selB,
    modalSlot, busqueda, filtroMarca,
    // Datos
    marcas, productosFiltrados, comparacion,
    // Acciones
    abrirModal, cerrarModal, seleccionar,
    limpiarSlot, intercambiar,
    setBusqueda, setFiltroMarca,
  }
}
