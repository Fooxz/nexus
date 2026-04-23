import {
  createEmptyBuild,
  SINGLE_SLOTS,
  SLOT_DEPENDENCIES,
} from './buildModel'

export function createBuild(caseId = 'mid-tower') {
  return createEmptyBuild(caseId)
}

export function setComponent(build, slotId, productId) {
  if (!SINGLE_SLOTS.includes(slotId)) {
    console.warn(`[builderEngine] setComponent: "${slotId}" no es un slot simple.`)
    return build
  }
  let next = {
    ...build,
    components: { ...build.components, [slotId]: productId },
  }
  const deps = SLOT_DEPENDENCIES[slotId]
  if (deps) next = clearDependencies(next, deps)
  return next
}

export function removeComponent(build, slotId) {
  if (!SINGLE_SLOTS.includes(slotId)) return build
  return {
    ...build,
    components: { ...build.components, [slotId]: null },
  }
}

export function setRamSlot(build, slotNumber, productId) {
  const existing = build.components.ramSlots.filter(r => r.slot !== slotNumber)
  const updated  = productId
    ? [...existing, { slot: slotNumber, productId }]
    : existing
  return {
    ...build,
    components: { ...build.components, ramSlots: updated },
  }
}

export function setStorageSlot(build, slotKey, productId) {
  const existing = build.components.storageSlots.filter(s => s.slot !== slotKey)
  const updated  = productId
    ? [...existing, { slot: slotKey, productId }]
    : existing
  return {
    ...build,
    components: { ...build.components, storageSlots: updated },
  }
}

// Aplica múltiples slots simples de una vez — para presets
// No limpia dependencias entre slots del mismo preset
export function applyPreset(build, slots) {
  const components = { ...build.components }
  Object.entries(slots).forEach(([slotId, productId]) => {
    if (SINGLE_SLOTS.includes(slotId)) {
      components[slotId] = productId
    }
  })
  return { ...build, components }
}

export function clearBuild(build) {
  return createEmptyBuild(build.caseId)
}

export function setCaseId(build, caseId) {
  return { ...build, caseId }
}

export function validateStructure(build) {
  const errors = []
  if (!build.version)    errors.push('Falta version')
  if (!build.caseId)     errors.push('Falta caseId')
  if (!build.components) errors.push('Falta components')
  return { valid: errors.length === 0, errors }
}

export function exportBuild(build) {
  return JSON.stringify(build, null, 2)
}

export function importBuild(json) {
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json
    const { valid, errors } = validateStructure(parsed)
    if (!valid) { console.warn('[builderEngine] importBuild inválido', errors); return null }
    return parsed
  } catch (e) {
    console.warn('[builderEngine] JSON inválido', e)
    return null
  }
}

function clearDependencies(build, deps) {
  const components = { ...build.components }
  deps.forEach(dep => {
    if (dep === 'ramSlots') components.ramSlots = []
    else components[dep] = null
  })
  return { ...build, components }
}
