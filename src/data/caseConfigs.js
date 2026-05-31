// =============================================
// NEXUS — CASE CONFIGS
// Responsabilidad única: el chasis decide dónde
// van las piezas que él mismo aloja, y cómo
// están orientadas las piezas que NO dependen
// de la board (psu, storage).
//
// El chasis controla:
//   - position de: motherboard, psu, storage
//   - scale y rotation de: psu, storage
//   - scale del chasis en sí
//
// La board controla (boardGeometry.js):
//   - scale y rotation de: motherboard, cpu, gpu, ram, cooling
//   - position de: cpu, gpu, ram, cooling
// =============================================

export const CASE_CONFIGS = {

  'mid-tower': {
    label:  'Mid Tower',
    modelo: '/modelos/cases/case.glb',
    scale:  1,
    
    positions: {
      motherboard: [0,     1.8,   0.2  ],
      psu:         [-1.19,-0.78, -0.27 ],
      storageSata: [-0.59,-0.26, -0.57 ],
    },
    scales: {
      psu:        0.42,
      storageSata: 10.37,
    },
    rotations: {
      psu:         [-0.01, -1.58,  0    ],
      storageSata: [0,      0.01,  0.01 ],
    },
  },

  'case-gamer': {
    label:  'Case Gamer',
    modelo: '/modelos/cases/caseGamer.glb',
    scale:  10.5, 
    position: [0, 1.5, 0.27],
    rotation: [0, 0, 0],                             // ajustar en escena
    positions: {
      motherboard: [0,     1.8,   0.2  ],
      psu:         [-1.19,  0.1, 0.009 ],
      storageSata: [0.59,-0.26, -0.1 ],
    },
    scales: {
      psu:         0.42,
      storageSata: 10.37,
    },
    rotations: {
      psu:         [-0.01, -1.58,  0    ],
      storageSata: [0,      0.01,  0.01 ],
    },
    fan: {
      position: [0.5, -0.3, -0.5],
      scale:    9,
      rotation: [0, 0, 0],
    },
  },

  'case-pro': {
    label:  'Case Pro',
    modelo: '/modelos/cases/casePro.glb',
    scale:  0.68,
    position: [2.2, -1, 4.4],
    rotation: [0, Math.PI/2, 0],
    positions: {
      motherboard: [0,     1.8,   0.2  ],
      psu:         [-1.19,0, -0.01 ],
      storageSata: [-0.59,0.4, 0.5 ],
    },
    scales: {
      psu:         0.42,
      storageSata: 10.37,
    },
    rotations: {
      psu:         [-0.01, -1.58,  0    ],
      storageSata: [0,      0.01,  0.01 ],
    },
  },

  // Próximos gabinetes — agregar cuando tengas el .glb
  // 'nzxt-h510':       { ... }
  // 'lian-li-o11':     { ... }
  // 'fractal-meshify': { ... }

}

export const DEFAULT_CASE = 'mid-tower'