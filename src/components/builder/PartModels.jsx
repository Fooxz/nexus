// src/components/builder/PartModels.jsx
import { Text } from '@react-three/drei'
import { useGLTF } from '@react-three/drei'

// =============================================
// MODELOS REALES (GLB)
// =============================================

export function CaseModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF('/modelos/cases/case.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}

export function CaseGamerModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF('/modelos/cases/caseGamer.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}

export function CaseProModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF('/modelos/cases/casePro.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}

export function FanModel({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const { scene } = useGLTF('/modelos/cooling/fan.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}

useGLTF.preload('/modelos/cases/case.glb')
useGLTF.preload('/modelos/cases/caseGamer.glb')
useGLTF.preload('/modelos/cases/casePro.glb')
useGLTF.preload('/modelos/cooling/fan.glb')

export function MotherboardModelReal({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/motherboards/motherboard.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/motherboards/motherboard.glb')

export function CpuModelReal({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/cpu/cpu-amd.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/cpu/cpu-amd.glb')

export function GpuAmdModel({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/gpu/gpu-amd.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/gpu/gpu-amd.glb')

export function GpuNvidiaModel({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/gpu/gpu-nvidia.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/gpu/gpu-nvidia.glb')

export function RamModelReal({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/ram/ram-ddr4.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/ram/ram-ddr4.glb')

// PSU — 3 modelos disponibles: psu3, psu4, psu-alt
export function PsuModelReal({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/psu/psu3.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/psu/psu3.glb')

export function PsuAltModel({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/psu/psu4.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/psu/psu4.glb')

export function PsuAlt2Model({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/psu/psu-alt.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/psu/psu-alt.glb')

export function CoolerModelReal({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/cooling/cooler.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/cooling/cooler.glb')

export function StorageKingstonModel({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/ram/ram-ddr4.glb')  // fallback hasta que exista ram-kingston.glb
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}

export function StorageSamsungModel({ position, rotation = [0, 0, 0], scale = 0.5 }) {
  const { scene } = useGLTF('/modelos/storage/storage-samsung.glb')
  const model = scene.clone()
  return <primitive object={model} position={position} scale={scale} rotation={rotation} castShadow receiveShadow />
}
useGLTF.preload('/modelos/storage/storage-samsung.glb')

// =============================================
// SELECTOR DINÁMICO
// =============================================

export function PartModel({ type, brand, position, rotation = [0, 0, 0], scale = 0.5 }) {
  if (type === 'gpu') {
    if (brand?.toLowerCase().includes('nvidia')) {
      return <GpuNvidiaModel position={position} rotation={rotation} scale={scale} />
    }
    return <GpuAmdModel position={position} rotation={rotation} scale={scale} />
  }
  if (type === 'storage') {
    if (brand?.toLowerCase().includes('samsung')) {
      return <StorageSamsungModel position={position} rotation={rotation} scale={scale} />
    }
    return <StorageKingstonModel position={position} rotation={rotation} scale={scale} />
  }
  if (type === 'psu') {
    return <PsuModelReal position={position} rotation={rotation} scale={scale} />
  }
  return null
}

// =============================================
// PLACEHOLDERS
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

export function CpuModelPlaceholder({ position, part }) {
  return <PlaceholderModel color="#4a90e2" position={position} scale={[0.8, 0.3, 0.8]} rotation={[Math.PI/2, 0, 0]} label={part?.nombre?.split(' ')[0] || 'CPU'} />
}
export function GpuModelPlaceholder({ position, part }) {
  return <PlaceholderModel color="#e24a4a" position={position} scale={[1.2, 0.5, 2.5]} rotation={[Math.PI/2, 0, 0]} label={part?.nombre?.split(' ')[0] || 'GPU'} />
}
export function RamModelPlaceholder({ position, part }) {
  return (
    <group position={position}>
      <PlaceholderModel color="#4ae24a" position={[0, 0, 0]}   scale={[0.2, 0.8, 0.1]} rotation={[0, 0, 0]} label={part?.nombre?.split(' ')[0] || 'RAM'} />
      <PlaceholderModel color="#4ae24a" position={[0.5, 0, 0]} scale={[0.2, 0.8, 0.1]} rotation={[0, 0, 0]} />
    </group>
  )
}
export function StorageModelPlaceholder({ position, part }) {
  return <PlaceholderModel color="#e2b84a" position={position} scale={[1, 0.3, 0.5]} rotation={[Math.PI/2, 0, 0]} label={part?.tipo || 'SSD'} />
}
export function PsuModelPlaceholder({ position }) {
  return <PlaceholderModel color="#4a4ae2" position={position} scale={[1.5, 0.8, 1.5]} rotation={[Math.PI/2, 0, 0]} label="PSU" />
}
export function MotherboardModelPlaceholder({ position }) {
  return <PlaceholderModel color="#555555" position={position} scale={[3.0, 0.1, 3.5]} rotation={[Math.PI/2, 0, 0]} label="MB" />
}
export function CoolerModelPlaceholder({ position }) {
  return <PlaceholderModel color="#888888" position={position} scale={[0.9, 0.9, 0.9]} rotation={[0, 0, 0]} label="FAN" />
}