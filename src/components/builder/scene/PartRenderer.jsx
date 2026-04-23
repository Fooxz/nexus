// Responsabilidad única: dado un slot y una parte,
// carga el GLB correcto y aplica el color dinámico.
import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Registry: modelGlb del producto → ruta del archivo
// Para agregar un modelo nuevo: solo agrega una línea aquí
const GLB_PATHS = {
  'cpu-amd':         '/modelos/cpu/cpu-amd.glb',
  'gpu-amd':         '/modelos/gpu/gpu-amd.glb',
  'gpu-nvidia':      '/modelos/gpu/gpu-nvidia.glb',
  'ram-ddr4':        '/modelos/ram/ram-ddr4.glb',
  'ram-kingston':    '/modelos/ram/ram-kingston.glb',
  'motherboard':     '/modelos/motherboards/motherboard.glb',
  
  'psu3':            '/modelos/psu/psu3.glb',
  'psu4':            '/modelos/psu/psu4.glb',
  'cooler':          '/modelos/cooling/cooler.glb',
  'storage-samsung': '/modelos/storage/storage-samsung.glb',
}

// Aplica color dinámico al mesh objetivo dentro del GLB
function applyColor(sceneRef, color, targetMesh) {
  if (!color || !sceneRef) return
  const targetColor = new THREE.Color(color)
  let meshFound = false

  // Intento 1: buscar por nombre de mesh
  sceneRef.traverse(node => {
    if (node.isMesh && node.name.toLowerCase().includes(targetMesh?.toLowerCase() || '')) {
      node.material = node.material.clone()
      node.material.color.set(targetColor)
      meshFound = true
    }
  })

  // Fallback: si no encontró el mesh por nombre, colorea todos
  if (!meshFound) {
    sceneRef.traverse(node => {
      if (node.isMesh) {
        node.material = node.material.clone()
        node.material.color.set(targetColor)
      }
    })
  }
}

// Carga un GLB y aplica color dinámico
function GlbModel({ glbKey, color, targetMesh, position, rotation, scale }) {
  const { scene } = useGLTF(GLB_PATHS[glbKey])
  const groupRef = useRef()
  const model = scene.clone()

  useEffect(() => {
    if (groupRef.current) {
      applyColor(groupRef.current, color, targetMesh)
    }
  }, [color, targetMesh])

  return (
    <group ref={groupRef}>
      <primitive
        object={model}
        position={position}
        rotation={rotation}
        scale={scale}
        castShadow
        receiveShadow
      />
    </group>
  )
}

// Punto de entrada público
export default function PartRenderer({ type, part, position, rotation, scale }) {
  if (!part?.modelGlb) return null

  const path = GLB_PATHS[part.modelGlb]
  if (!path) {
    console.warn(`[PartRenderer] GLB no registrado: "${part.modelGlb}"`)
    return null
  }

  const finalScale = part.modelScale ?? scale

  const finalPos = part.modelOffset
    ? [
        position[0] + part.modelOffset[0],
        position[1] + part.modelOffset[1],
        position[2] + part.modelOffset[2],
      ]
    : position

  const finalRotation = part.modelRotation
    ? [
        rotation[0] + part.modelRotation[0],
        rotation[1] + part.modelRotation[1],
        rotation[2] + part.modelRotation[2],
      ]
    : rotation

  return (
    <GlbModel
      glbKey={part.modelGlb}
      color={part.modelColor}
      targetMesh={part.modelMesh}
      position={finalPos}
      rotation={finalRotation}
      scale={finalScale}
    />
  )
}

// Precarga todos los GLBs al arrancar
Object.values(GLB_PATHS).forEach(path => useGLTF.preload(path))
