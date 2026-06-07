// =============================================
// NEXUS — SLOT CONFIG
// =============================================

export const SLOT_CONFIG = [
  { id: "case",        label: "Gabinete",        icon: "  ", required: false },
  { id: "motherboard", label: "Placa Madre",      icon: "  ", required: true  },
  { id: "cpu",         label: "Procesador",       icon: "  ", required: true  },
  { id: "gpu",         label: "Tarjeta Gráfica",  icon: "  ", required: true  },
  { id: "ram",         label: "Memoria RAM",       icon: "  ", required: true  },
  { id: "storage",     label: "Almacenamiento",   icon: "  ", required: true  },
  { id: "psu",         label: "Fuente de Poder",  icon: "  ", required: true  },
  { id: "cooling",     label: "Refrigeración",    icon: "  ", required: true  },
]

export const PRESETS = {
  basico: {
    cpu: "cpu-6", motherboard: "mb-1", ram: "ram-1",
    gpu: "gpu-1", storage: "sto-1", psu: "psu-1",
    case: "case-1", cooling: "cool-1",
  },
  gamer: {
    cpu: "cpu-2", motherboard: "mb-2", ram: "ram-2",
    gpu: "gpu-3", storage: "sto-4", psu: "psu-3",
    case: "case-gamer", cooling: "cool-2",
  },
  pro: {
    cpu: "cpu-4", motherboard: "mb-3", ram: "ram-2",
    gpu: "gpu-4", storage: "sto-4", psu: "psu-4",
    case: "case-pro", cooling: "cool-3",
  },
}

export const PRESETS_META = [
  { key: 'basico', label: ' Básico', price:  '~$3.612.000' },
  { key: 'gamer',  label: ' Gamer',  price: '~$5.708.500' },
  { key: 'pro',    label: ' Pro',    price: '~$7.988.500' },
]