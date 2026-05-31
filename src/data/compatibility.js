// =============================================
// NEXUS — COMPATIBILITY
// Responsabilidad única: lógica de compatibilidad
// entre componentes del PC Builder.
// =============================================

const RULES = [
  {
    id: 'cpu-socket',
    check: ({ cpu, motherboard }) =>
      cpu && motherboard && cpu.socket !== motherboard.socket,
    message: ({ cpu, motherboard }) =>
      `Socket incompatible: CPU ${cpu.socket} ≠ Placa ${motherboard.socket}`,
    tipo: 'error',
  },
  {
    id: 'ram-type',
    // ram viene de ramSlots[0].product — no directamente como "ram"
    check: ({ motherboard, ramSlots }) => {
      const ram = ramSlots?.[0]?.product
      return motherboard && ram && ram.tipo !== motherboard.formatoRam
    },
    message: ({ motherboard, ramSlots }) => {
      const ram = ramSlots?.[0]?.product
      return `RAM incompatible: ${ram?.tipo} no es compatible con ${motherboard.formatoRam}`
    },
    tipo: 'error',
  },
  {
    id: 'ram-slots',
    // Avisa si el usuario intenta poner más RAM de lo que acepta la board
    check: ({ motherboard, ramSlots }) => {
      const maxSlots = motherboard?.slotsRam ?? 4
      return ramSlots && ramSlots.length > maxSlots
    },
    message: ({ motherboard, ramSlots }) =>
      `Demasiados módulos RAM: la placa acepta máximo ${motherboard.slotsRam} slots`,
    tipo: 'error',
  },
  {
    id: 'psu-wattage',
    check: ({ cpu, gpu, psu }) => {
      const needed = (gpu?.potencia || 0) + (cpu?.tdp || 0) + 100
      return psu && needed > psu.potencia
    },
    message: ({ cpu, gpu, psu }) => {
      const needed = (gpu?.potencia || 0) + (cpu?.tdp || 0) + 100
      return `Fuente insuficiente: necesitas ~${needed}W, tienes ${psu.potencia}W`
    },
    tipo: 'warning',
  },
  {
    id: 'cooling-tdp',
    check: ({ cpu, cooling }) =>
      cpu && cooling && cpu.tdp > cooling.tdpSoporte,
    message: ({ cpu, cooling }) =>
      `Refrigeración insuficiente: CPU necesita ${cpu.tdp}W TDP, el cooler soporta ${cooling.tdpSoporte}W`,
    tipo: 'warning',
  },
]

export function checkCompatibility(build) {
  if (Object.keys(build).length === 0) return []

  const warnings = RULES
    .filter(rule => rule.check(build))
    .map(rule => ({ tipo: rule.tipo, msg: rule.message(build) }))

  if (warnings.length === 0)
    warnings.push({ tipo: 'ok', msg: 'Todos los componentes son compatibles ✓' })

  return warnings
}