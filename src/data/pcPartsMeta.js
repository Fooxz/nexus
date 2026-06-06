// =============================================
// NEXUS — PC_PARTS_META
// Lookup de metadatos 3D indexado por nombre exacto.
// Usado para enriquecer productos del backend con sus
// datos de modelo 3D sin depender del mock completo.
// =============================================

export const PC_PARTS_META = {
  // ── CPUs ──────────────────────────────────────────────────
  "AMD Ryzen 5 5600X":   { id: "cpu-1", modelGlb: "cpu-amd",  modelMesh: "heatspreader" },
  "AMD Ryzen 7 5800X":   { id: "cpu-2", modelGlb: "cpu-amd",  modelMesh: "heatspreader" },
  "Intel Core i5-12400F":{ id: "cpu-3", modelGlb: "cpu-amd",  modelMesh: "heatspreader" },
  "Intel Core i7-12700K":{ id: "cpu-4", modelGlb: "cpu-amd",  modelMesh: "heatspreader" },
  "AMD Ryzen 9 7900X":   { id: "cpu-5", modelGlb: "cpu-amd",  modelMesh: "heatspreader" },
  "Intel Core i5-10400F":{ id: "cpu-6", modelGlb: "cpu-amd",  modelMesh: "heatspreader" },
  "Intel Core i7-10700K":{ id: "cpu-7", modelGlb: "cpu-amd",  modelMesh: "heatspreader" },

  // ── GPUs ──────────────────────────────────────────────────
  "NVIDIA RTX 3060":  { id: "gpu-1", modelGlb: "gpu-nvidia", modelMesh: "shroud" },
  "NVIDIA RTX 3070 Ti":{ id: "gpu-2", modelGlb: "gpu-nvidia", modelMesh: "shroud", modelColor: "#4a9900" },
  "AMD RX 6700 XT":   { id: "gpu-3", modelGlb: "gpu-amd",   modelMesh: "shroud",  modelColor: "#ed1c24", modelScale: 10.9, modelOffset: [-0.01, -0.259, 1.5], modelRotation: [1.5708, 0, 3.1416] },
  "NVIDIA RTX 4070":  { id: "gpu-4", modelGlb: "gpu-nvidia", modelMesh: "shroud" },
  "AMD RX 7900 XT":   { id: "gpu-5", modelGlb: "gpu-amd",   modelMesh: "shroud",  modelColor: "#a38080", modelScale: 10.9, modelOffset: [-0.01, -0.259, 1.5], modelRotation: [1.5708, 0, 3.1416] },

  // ── RAMs ──────────────────────────────────────────────────
  "Corsair Vengeance 16GB DDR4": { id: "ram-1", modelGlb: "ram-ddr4",    modelMesh: "heatsink",  modelColor: "#ffcc00" },
  "G.Skill Ripjaws 32GB DDR4":   { id: "ram-2", modelGlb: "ram-ddr4",    modelMesh: "LED_Strip", modelColor: "#cc0000" },
  "Kingston Fury 16GB DDR5":     { id: "ram-3", modelGlb: "ram-kingston",modelMesh: "heatsink",  modelColor: "#000000" },
  "Corsair Dominator 32GB DDR5": { id: "ram-4", modelGlb: "ram-ddr4",    modelMesh: "heatsink",  modelColor: "#ffffff" },

  // ── Motherboards ──────────────────────────────────────────
  "ASUS Prime H510M-K":  { id: "mb-1", modelGlb: "motherboard",      modelMesh: "pcb" },
  "ASUS ROG Strix B550-F":{ id: "mb-2", modelGlb: "motherboard-b550f", modelMesh: "pcb" },
  "ASUS TUF Gaming B660M":{ id: "mb-3", modelGlb: "motherboard-b660m", modelMesh: "pcb" },

  // ── Storages ──────────────────────────────────────────────
  "Samsung 970 EVO 500GB":    { id: "sto-1", modelGlb: "storage-samsung", modelMesh: "label", modelColor: "#1428a0" },
  "WD Blue SN570 1TB":        { id: "sto-2", modelGlb: "storage-samsung", modelMesh: "label", modelColor: "#005eb8" },
  "Seagate Barracuda 2TB HDD":{ id: "sto-3", modelGlb: "storage-samsung", modelMesh: "label", modelColor: "#2d9e2d" },
  "Samsung 990 Pro 1TB":      { id: "sto-4", modelGlb: "storage-samsung", modelMesh: "label", modelColor: "#0a1464" },

  // ── PSUs ──────────────────────────────────────────────────
  "Corsair CV550 550W Bronze":    { id: "psu-1", modelGlb: "psu3", modelMesh: "casing", modelColor: "#ffcc00", modelScale: 9.10, modelOffset: [0.1, 0, 0.2], modelRotation: [0, 0, 0] },
  "EVGA 650W Gold":               { id: "psu-2", modelGlb: "psu4", modelMesh: "casing", modelColor: "#222222", modelScale: 0.45, modelOffset: [0, 0, 0],    modelRotation: [0, 0, 0] },
  "Seasonic Focus GX-750W Gold":  { id: "psu-3", modelGlb: "psu4", modelMesh: "casing", modelColor: "#1a1a1a", modelScale: 0.45, modelOffset: [0, 0, 0],    modelRotation: [0, 0, 0] },
  "Corsair RM850x 850W Gold":     { id: "psu-4", modelGlb: "psu4", modelMesh: "casing", modelColor: "#ffcc00", modelScale: 0.45, modelOffset: [0, 0, 0],    modelRotation: [0, 0, 0] },

  // ── Cases ─────────────────────────────────────────────────
  "NZXT H510":            { id: "case-1",     modelGlb: "case",       modelColor: "#ffffff", caseConfigId: "mid-tower"  },
  "Nightshark RGB":       { id: "case-gamer", modelGlb: "case-gamer", modelColor: "#111111", caseConfigId: "case-gamer" },
  "Lian Li O11 Dynamic EVO":{ id: "case-pro", modelGlb: "case-pro",  modelColor: "#ffffff", caseConfigId: "case-pro"   },

  // ── Coolings ──────────────────────────────────────────────
  "Cooler Master Hyper 212":   { id: "cool-1", modelGlb: "cooler", modelMesh: "fan_ring", modelColor: "#888888" },
  "be quiet! Dark Rock 4":     { id: "cool-2", modelGlb: "cooler", modelMesh: "fan_ring", modelColor: "#111111" },
  "Corsair H100i Elite 240mm": { id: "cool-3", modelGlb: "cooler", modelMesh: "fan_ring", modelColor: "#ffcc00" },
  "NZXT Kraken X63 280mm":     { id: "cool-4", modelGlb: "cooler", modelMesh: "fan_ring", modelColor: "#cc0000" },
}

/**
 * Enriquece un producto del backend con sus metadatos 3D.
 * Busca por nombre exacto en el lookup.
 * @param {Object} producto - Producto del backend
 * @returns {Object} - Producto con metadatos 3D agregados
 */
export function enrichWithMeta(producto) {
  const nombre = producto.producto?.nombre ?? producto.nombre
  const meta   = PC_PARTS_META[nombre]
  if (!meta) return producto
  return {
    ...producto,
    modelKey:     meta.id,
    modelGlb:     meta.modelGlb,
    modelMesh:    meta.modelMesh,
    modelColor:   meta.modelColor   ?? producto.modelColor,
    modelScale:   meta.modelScale   ?? producto.modelScale,
    modelOffset:  meta.modelOffset  ?? producto.modelOffset,
    modelRotation:meta.modelRotation?? producto.modelRotation,
    caseConfigId: meta.caseConfigId ?? producto.caseConfigId,
  }
}