// =============================================
// NEXUS — SLOT CONFIG
// Responsabilidad única: configuración del
// PC Builder — qué slots existen y qué presets
// hay disponibles. No sabe de datos de productos
// ni de lógica de compatibilidad.
// =============================================

export const SLOT_CONFIG = [
  { id: "cpu",         label: "Procesador",     icon: "⚡", required: true  },
  { id: "motherboard", label: "Placa Madre",     icon: "🔧", required: true  },
  { id: "ram",         label: "Memoria RAM",     icon: "💾", required: true  },
  { id: "gpu",         label: "Tarjeta Gráfica", icon: "🎮", required: true  },
  { id: "storage",     label: "Almacenamiento",  icon: "💿", required: true  },
  { id: "psu",         label: "Fuente de Poder", icon: "🔌", required: true  },
  { id: "case",        label: "Gabinete",        icon: "🖥️", required: false },
  { id: "cooling",     label: "Refrigeración",   icon: "❄️", required: false },
]

// IDs de productos — cuando venga la API serán IDs reales de la BD
export const PRESETS = {
  basico: {
    cpu: "cpu-3", motherboard: "mb-1", ram: "ram-1",
    gpu: "gpu-1", storage: "sto-2",   psu: "psu-1",
  },
  gamer: {
    cpu: "cpu-2", motherboard: "mb-4", ram: "ram-2",
    gpu: "gpu-2", storage: "sto-4",   psu: "psu-3",
  },
  pro: {
    cpu: "cpu-5", motherboard: "mb-3", ram: "ram-4",
    gpu: "gpu-4", storage: "sto-4",   psu: "psu-4",
  },
}

// Metadata visual de los presets para la UI
export const PRESETS_META = [
  { key: 'basico', label: '💻 Básico', price: '~$700'   },
  { key: 'gamer',  label: '🎮 Gamer',  price: '~$1,200' },
  { key: 'pro',    label: '🚀 Pro',    price: '~$2,000' },
]
