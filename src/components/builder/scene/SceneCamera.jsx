// Responsabilidad única: configurar la cámara y controles de la escena
import { OrbitControls } from '@react-three/drei'

export default function SceneCamera() {
  return (
    <OrbitControls
      enablePan
      enableZoom
      enableRotate
      maxPolarAngle={Math.PI / 2}
      minDistance={3}
      maxDistance={20}
      target={[0, 1, 0]}
    />
  )
}
