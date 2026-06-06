// =============================================
// NEXUS — useComparador
// Responsabilidad única: estado de UI del comparador.
// Coordina servicios + estado React.
// No calcula nada — eso es trabajo del service.
// =============================================
import { useState, useMemo, useCallback, useEffect } from 'react'
import { getCelulares } from '../services/celularService'
import {
  calcularScoresRadar,
  calcularVentajas,
  calcularScoreGlobal,
} from '../services/comparadorService'

export function useComparador() {
  const [selA, setSelA]               = useState(null)
  const [selB, setSelB]               = useState(null)
  const [modalSlot, setModalSlot]     = useState(null)
  const [busqueda, setBusqueda]       = useState('')
  const [filtroMarca, setFiltroMarca] = useState('Todas')
  const [celulares, setCelulares]     = useState([])

  useEffect(() => {
    getCelulares().then(data => setCelulares(data)).catch(console.error)
  }, [])

  const marcas = useMemo(() => {
    const set = new Set(celulares.map(c => c.producto?.marca ?? c.marca))
    return ['Todas', ...Array.from(set).sort()]
  }, [celulares])

  const productosFiltrados = useMemo(() => {
    return celulares.filter(c => {
      const matchMarca = filtroMarca === 'Todas' || (c.producto?.marca ?? c.marca) === filtroMarca
      const q         = busqueda.toLowerCase()
      const matchBusqueda = !q ||
        (c.modelo ?? '').toLowerCase().includes(q) ||
        (c.producto?.marca ?? c.marca ?? '').toLowerCase().includes(q)
      const otroSlot  = modalSlot === 'a' ? selB : selA
      const noEsMismo = !otroSlot || otroSlot.id !== c.id
      return matchMarca && matchBusqueda && noEsMismo
    })
  }, [busqueda, filtroMarca, modalSlot, selA, selB])

  const comparacion = useMemo(() => {
    if (!selA || !selB) return null
    return {
      scores:       calcularScoresRadar(selA, selB),
      ventajas:     calcularVentajas(selA, selB),
      scoreGlobalA: calcularScoreGlobal(selA),
      scoreGlobalB: calcularScoreGlobal(selB),
    }
  }, [selA, selB])

  const abrirModal  = useCallback((slot) => {
    setModalSlot(slot); setBusqueda(''); setFiltroMarca('Todas')
  }, [])

  const cerrarModal = useCallback(() => setModalSlot(null), [])

  const seleccionar = useCallback((c) => {
    const prod = c.producto ?? c
    const normalizado = {
      id:              c.id,
      modelo:          c.modelo,
      storage:         c.storage,
      color:           c.color,
      marca:           prod.marca,
      precio:          prod.precio,
      imagen:          prod.imagen,
      precioNormal:    c.precioNormal,
      descuento:       c.descuento ?? 0,
      pantalla:        c.pantalla,
      resolucion:      c.resolucion,
      so:              c.so,
      procesador:      c.procesador,
      ram:             c.ram,
      almacenamiento:  c.almacenamiento,
      camaraPrincipal: c.camaraPrincipal,
      camaraFrontal:   c.camaraFrontal,
      bateria:         c.bateria,
      tieneNfc:        c.tieneNfc,
      tiene5g:         c.tiene5g,
    }

    if (modalSlot === 'a') setSelA(normalizado)
    if (modalSlot === 'b') setSelB(normalizado)
    cerrarModal()
  }, [modalSlot, cerrarModal])

  const limpiarSlot = useCallback((slot) => {
    if (slot === 'a') setSelA(null)
    if (slot === 'b') setSelB(null)
  }, [])

  const intercambiar = useCallback(() => {
    setSelA(selB); setSelB(selA)
  }, [selA, selB])

  return {
    selA, selB, modalSlot, busqueda, filtroMarca,
    marcas, productosFiltrados, comparacion,
    abrirModal, cerrarModal, seleccionar,
    limpiarSlot, intercambiar,
    setBusqueda, setFiltroMarca,
  }
}