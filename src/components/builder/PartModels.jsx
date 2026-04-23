// src/components/builder/PartModels.jsx
import { Text } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'

// =============================================
// MODELOS REALES (GLB)
// =============================================

// Gabinete REAL
export function CaseModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF('/modelos/cases/case.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/cases/case.glb')

// Motherboard REAL
export function MotherboardModelReal({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/motherboards/motherboard.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/motherboards/motherboard.glb')

// CPU AMD REAL
export function CpuModelReal({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/cpu/cpu-amd.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/cpu/cpu-amd.glb')

// GPU AMD REAL
export function GpuAmdModel({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/gpu/gpu-amd.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/gpu/gpu-amd.glb')

// GPU NVIDIA REAL
export function GpuNvidiaModel({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/gpu/gpu-nvidia.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/gpu/gpu-nvidia.glb')

// RAM REAL
export function RamModelReal({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/ram/ram-ddr4.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/ram/ram-ddr4.glb')

// PSU REAL
export function PsuModelReal({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/psu/psu.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/psu/psu.glb')

// PSU Alternativa REAL
export function PsuAltModel({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/psu/psu-alt.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/psu/psu-alt.glb')

// Cooler REAL
export function CoolerModelReal({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/cooling/cooler.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/cooling/cooler.glb')

// Storage Kingston REAL
export function StorageKingstonModel({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/ram/ram-kingston.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/storage/storage-kingston.glb')

// Storage Samsung REAL
export function StorageSamsungModel({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/storage/storage-samsung.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/storage/storage-samsung.glb')

// =============================================
// SELECTOR DINÁMICO (elige el modelo según marca)
// =============================================

export function PartModel({ type, brand, position, rotation = [0, 0, 0], scale = 0.5 }) {
  // GPU
  if (type === 'gpu') {
    if (brand?.toLowerCase().includes('nvidia')) {
      return <GpuNvidiaModel position={position} rotation={rotation} scale={scale} />
    } else {
      return <GpuAmdModel position={position} rotation={rotation} scale={scale} />
    }
  }
  
  // Storage
  if (type === 'storage') {
    if (brand?.toLowerCase().includes('samsung')) {
      return <StorageSamsungModel position={position} rotation={rotation} scale={scale} />
    } else {
      return <StorageKingstonModel position={position} rotation={rotation} scale={scale} />
    }
  }
  
  // PSU
  if (type === 'psu') {
    return <PsuModelReal position={position} rotation={rotation} scale={scale} />
  }
  
  return null
}

// =============================================
// PLACEHOLDERS (por si algo falla)
// =============================================

function PlaceholderModel({ color, position, scale = [1, 1, 1], label, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={scale} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>
      <Text position={[0, scale[1]/2 + 0.2, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  )
}

// Placeholders
export function CpuModelPlaceholder({ position, part }) {
  return <PlaceholderModel color="#4a90e2" position={position} scale={[0.8, 0.3, 0.8]} rotation={[Math.PI/2, 0, 0]} label={part?.nombre?.split(' ')[0] || 'CPU'} />
}

export function GpuModelPlaceholder({ position, part }) {
  return <PlaceholderModel color="#e24a4a" position={position} scale={[1.2, 0.5, 2.5]} rotation={[Math.PI/2, 0, 0]} label={part?.nombre?.split(' ')[0] || 'GPU'} />
}

export function RamModelPlaceholder({ position, part }) {
  return (
    <group position={position}>
      <PlaceholderModel color="#4ae24a" position={[0, 0, 0]} scale={[0.2, 0.8, 0.1]} rotation={[0, 0, 0]} label={part?.nombre?.split(' ')[0] || 'RAM'} />
      <PlaceholderModel color="#4ae24a" position={[0.5, 0, 0]} scale={[0.2, 0.8, 0.1]} rotation={[0, 0, 0]} />
    </group>
  )
}

export function StorageModelPlaceholder({ position, part }) {
  return <PlaceholderModel color="#e2b84a" position={position} scale={[1, 0.3, 0.5]} rotation={[Math.PI/2, 0, 0]} label={part?.tipo || 'SSD'} />
}

export function PsuModelPlaceholder({ position, part }) {
  return <PlaceholderModel color="#4a4ae2" position={position} scale={[1.5, 0.8, 1.5]} rotation={[Math.PI/2, 0, 0]} label="PSU" />
}

export function MotherboardModelPlaceholder({ position }) {
  return <PlaceholderModel color="#555555" position={position} scale={[3.0, 0.1, 3.5]} rotation={[Math.PI/2, 0, 0]} label="MB" />
}

export function CoolerModelPlaceholder({ position, part }) {
  return <PlaceholderModel color="#888888" position={position} scale={[0.9, 0.9, 0.9]} rotation={[0, 0, 0]} label="FAN" />
}