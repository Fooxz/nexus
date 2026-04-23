// Responsabilidad única: configurar las luces de la escena 3D
import { Environment } from '@react-three/drei'

export default function SceneLights() {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={1024}
      />
    </>
  )
}
