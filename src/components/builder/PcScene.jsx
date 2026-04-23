// Responsabilidad única: orquestar el canvas 3D.
// No sabe de posiciones, escalas, marcas ni luces.
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { CASE_CONFIGS, DEFAULT_CASE } from '../../data/caseConfigs'
import SceneLights        from './scene/SceneLights'
import SceneCamera        from './scene/SceneCamera'
import PartRenderer       from './scene/PartRenderer'
import SceneStrip         from './scene/SceneStrip'
import SceneErrorBoundary from './scene/SceneErrorBoundary'
import { CaseModel }      from './PartModels'

const SLOTS = ['motherboard','cpu','gpu','storage','psu','cooling']

const isEmpty = (build) => !build?.cpu && !build?.gpu && !build?.ramSlots?.length

// Placeholder que se muestra mientras carga un GLB
function LoadingPart() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#2a2f3a" wireframe />
    </mesh>
  )
}


// Placeholder cuando un GLB falla — no rompe nada, solo no se muestra
function FailedPart() {
  return null
}

export default function PcScene({ build = {}, selectedCase = DEFAULT_CASE }) {
  const config = CASE_CONFIGS[selectedCase] ?? CASE_CONFIGS[DEFAULT_CASE]

  const normalizedBuild = {
    ...build,
    ram:     build.ramSlots?.[0]?.product     ?? build.ram     ?? null,
    storage: build.storageSlots?.[0]?.product ?? build.storage ?? null,
  }

  return (
    <div className="sidebar-visual-wrap">
      <div className="sidebar-case">

        {/* ErrorBoundary exterior: si el Canvas entero falla */}
        <SceneErrorBoundary fallback={
          <div className="visual-empty">
            <div className="visual-empty-icon">⚠️</div>
            <div className="visual-empty-text">
              Error al cargar el visualizador 3D.<br/>
              El builder sigue funcionando con normalidad.
            </div>
          </div>
        }>
          <Canvas
            camera={{ position: [6, 4, 10], fov: 45 }}
            shadows
            style={{ background: 'transparent' }}
          >
            <SceneLights />
            <SceneCamera />

            {/* Gabinete — con su propio Suspense + ErrorBoundary */}
            <SceneErrorBoundary fallback={<FailedPart />}>
              <Suspense fallback={<LoadingPart />}>
                <CaseModel
                  position={[0, 0, 0]}
                  scale={config.scale}
                  rotation={[0, 0, 0]}
                />
              </Suspense>
            </SceneErrorBoundary>

            {/* Cada componente tiene su propio Suspense + ErrorBoundary */}
            {SLOTS.map(slot =>
              normalizedBuild[slot] ? (
                <SceneErrorBoundary key={slot} fallback={<FailedPart />}>
                  <Suspense fallback={<LoadingPart />}>
                    <PartRenderer
                      type={slot}
                      part={normalizedBuild[slot]}
                      position={config.positions[slot]}
                      scale={config.scales[slot]}
                      rotation={config.rotations[slot]}
                    />
                  </Suspense>
                </SceneErrorBoundary>
              ) : null
            )}

            {/* Renderizar múltiples slots de RAM */}
            {(build.ramSlots || []).map(r => {
              const slotIdx = r.slot - 1
              const pos = config.ramSlots?.[slotIdx] ?? config.positions.ram
              return (
                <SceneErrorBoundary key={`ram-${r.slot}`} fallback={<FailedPart />}>
                  <Suspense fallback={<LoadingPart />}>
                    <PartRenderer
                      type="ram"
                      part={r.product}
                      position={pos}
                      scale={config.scales.ram}
                      rotation={config.rotations.ram}
                    />
                  </Suspense>
                </SceneErrorBoundary>
              )
            })}
          </Canvas>
        </SceneErrorBoundary>

        {isEmpty(normalizedBuild) && (
          <div className="visual-empty">
            <div className="visual-empty-icon">🖥️</div>
            <div className="visual-empty-text">
              Selecciona componentes para ver el ensamblado 3D
            </div>
          </div>
        )}
      </div>

      <SceneStrip build={normalizedBuild} />
    </div>
  )
}


