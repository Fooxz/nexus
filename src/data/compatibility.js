// =============================================
// NEXUS — COMPATIBILITY
// Responsabilidad única: lógica de compatibilidad
// entre componentes del PC Builder.
// No sabe de UI, no sabe de datos, no sabe de slots.
// Cuando el backend exista, esta lógica puede
// moverse a Spring Boot y este archivo consume
// el resultado del endpoint:
//   POST /api/builder/check-compatibility
// =============================================

// Cada regla es independiente — fácil de agregar más
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
    check: ({ motherboard, ram }) =>
      motherboard && ram && ram.tipo !== motherboard.formatoRam,
    message: ({ motherboard, ram }) =>
      `RAM incompatible: ${ram.tipo} no es compatible con ${motherboard.formatoRam}`,
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
