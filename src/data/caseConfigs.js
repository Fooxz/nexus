// =============================================
// NEXUS — CASE CONFIGS
// Single source of truth para posiciones,
// escalas y rotaciones de cada gabinete.
//


export const CASE_CONFIGS = {

  'mid-tower': {
    label:  'Mid Tower',
    modelo: '/modelos/cases/case.glb',
    scale:  1,
    positions: {
      motherboard: [0,     1.8,   0.2  ],
      cpu:         [0.1,   2.16,  0.25 ],
      gpu:         [0.52,  1.27, -0.6  ],
      ram:         [0.74,  2.1,   0.37 ],
      psu:         [-1.19,-0.78, -0.27 ],
      storage:     [-0.59,-0.26, -0.57 ],
      cooling:     [0.1,   2.4,   0.25 ],
    },
    scales: {
      motherboard: 0.5,
      cpu:         10.50,
      gpu:         0.55,
      ram:         0.35,
      psu:         0.42,
      storage:     10.37,
      cooling:     0.01,
    },
    rotations: {
      motherboard: [Math.PI / 2, 0,     0    ],
      cpu:         [1.5,         0,     0    ],
      gpu:         [-1.59,      -3.14,  0.02 ],
      ram:         [1.57,        0,    -0.04 ],
      psu:         [-0.01,      -1.58,  0    ],
      storage:     [0,           0.01,  0.01 ],
      cooling:     [0,           0,     0    ],
    },

    // Slots de RAM — posiciones para cada módulo
    // Se completan cuando se implemente la selección múltiple
    ramSlots: [
      [0.74, 2.1,  0.37],  // slot 1
      [0.84, 2.1,  0.37],  // slot 2 — ajustar con Needle
      
    ],
  },

  // Próximos gabinetes — agregar cuando tengas el .glb y lo ajustes con Needle
  // 'nzxt-h510':       { ... }
  // 'lian-li-o11':     { ... }
  // 'fractal-meshify': { ... }

}

export const DEFAULT_CASE = 'mid-tower'
