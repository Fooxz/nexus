// =============================================
// NEXUS — BOARD GEOMETRY
// Responsabilidad única: la board decide cómo
// se ve ella misma y dónde van sus componentes.
//
// La board controla:
//   - Su propia scale y rotation (depende del GLB)
//   - position, scale y rotation de: cpu, gpu, cooling
//   - positions de los slots RAM
//   - position del storage NVMe M.2 (va en la board)
//
// El chasis controla (caseConfigs.js):
//   - position de: motherboard, psu
//   - storage HDD/SATA (va en bahía del chasis)
//
// CÓMO AGREGAR UNA BOARD NUEVA:
//   1. Agrégala en mockComponentesPc.js con su modelGlb
//   2. Agrega una entrada aquí con el mismo id
//   3. Calibra en Blender: scale, rotation, y posiciones
//      de cpu, gpu, ram, cooling, m2
//   4. Listo — PcScene lo recoge automáticamente
// =============================================

export const BOARD_GEOMETRY = {

  // ASUS Prime H510M-K — LGA1200, DDR4, 2 slots
  'mb-1': {
    positionOffset: [0, 0, -0.6],
    scale:    0.5,
    rotation: [Math.PI / 2, 0, 0],
    cpu: {
      position: [0.11,  2.1, -0.36],
      scale:    10.50,
      rotation: [1.5,  0,    0   ],
    },
    gpu: {
      position: [0.42, 1.27, -1.25 ],
      scale:    0.55,
      rotation: [-1.59,-3.14, 0],
    },
    cooling: {
      position: [-0.1,  2.2,  0.9],
      scale:    0.295,
      rotation: [Math.PI / 2, 0, 0 ],
    },
    m2: {
      position: [-0.59,-0.26,-0.57],
      scale:    10.37,
      rotation: [0,    0.01, 0.01],
    },
    slotsRam: 2,
    ramScale:    0.35,
    ramRotation: [1.57, 0, -0.04],
    ramSlots: [
      [0.73, 2.1, -0.19],
      [0.83, 2.1, -0.19],
    ],
  },

  // ASUS ROG Strix B550-F — AM4, DDR4, 4 slots
  'mb-2': {
    positionOffset: [0, -1.5, -2.26],
    scale:    0.12,
    rotation: [Math.PI / 2, 0, 0],
    
    cpu: {
      position: [0.35,  2.25, -0.52],
      scale:    10.50,
      rotation: [1.5,  0,    0   ],
    },
    gpu: {
      position: [0.32, 1.31, -1.39 ],
      scale:    0.55,
      rotation: [-1.59,-3.14, 0],
    },
    cooling: {
      position: [0.18,  2.4,  0.6],
      scale:    0.278,
      rotation: [Math.PI / 2, 0, 0  ],
    },
    m2: {
      position: [-0.59,-0.26,-0.57],
      scale:    10.37,
      rotation: [0,    0.01, 0.01],
    },
    slotsRam: 4,
    ramScale:    0.35,
    ramRotation: [1.57, 0, -0.04],
    ramSlots: [
      [0.87, 2.21, -0.36],
      [0.97, 2.21, -0.36],
      [1.07, 2.21, -0.36],
      [1.19, 2.21, -0.36],
    ],
  },

  // ASUS TUF Gaming B660M — LGA1700, DDR4, 4 slots
  'mb-3': {
    positionOffset: [0, 0, -0.57],
    scale:    0.64,
    rotation: [0, 80.09, 0],
    cpu: {
      position: [0.02,  2.15, -0.35],
      scale:    10.80,
      rotation: [Math.PI / 2,  0,    0   ],
    },
    gpu: {
      position: [0, 1.29, -1.2 ],
      scale:    0.55,
      rotation: [-1.59,-3.14, 0.02],
    },
    cooling: {
      position: [-0.1,  2.18,  0.79],
      scale:    0.27,
      rotation: [Math.PI / 2,    0,    0   ],
    },
    m2: {
      position: [-0.59,-0.26,-0.57],
      scale:    10.37,
      rotation: [0,    0.01, 0.01],
    },
    slotsRam: 4,
    ramScale:    0.35,
    ramRotation: [Math.PI / 2, 0, -0.04],
    ramSlots: [
      [0.60, 2.2, -0.1],
      [0.70, 2.2, -0.1],
      [0.80, 2.2, -0.1],
      [0.91, 2.2, -0.1],
    ],
  },

  // EJEMPLO — board mATX futura con 2 slots RAM y GLB propio
  // 'mb-6': {
  //   scale:    0.4,
  //   rotation: [Math.PI / 2, 0, 0],
  //   cpu:     { position: [x,y,z], scale: 10.50, rotation: [rx,ry,rz] },
  //   gpu:     { position: [x,y,z], scale: 0.55,  rotation: [rx,ry,rz] },
  //   cooling: { position: [x,y,z], scale: 0.01,  rotation: [rx,ry,rz] },
  //   m2:      { position: [x,y,z], scale: 10.37, rotation: [rx,ry,rz] },
  //   slotsRam: 2,
  //   ramScale:    0.35,
  //   ramRotation: [1.57, 0, -0.04],
  //   ramSlots: [ [x,y,z], [x,y,z] ],
  // },
}