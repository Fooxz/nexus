// Responsabilidad única: orquestar el canvas 3D.
//
// SEPARACIÓN DE RESPONSABILIDADES:
//   caseConfigs   → posición/rotación del chasis en escena
//                   posición de motherboard, psu
//                   posición/scale/rotation de storage HDD/SATA
//   boardGeometry → scale/rotation de motherboard
//                   posición/scale/rotation de cpu, gpu, cooling, m2 (NVMe)
//                   posiciones/scale/rotation de ram
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { CASE_CONFIGS, DEFAULT_CASE } from '../../data/caseConfigs'
import { BOARD_GEOMETRY }             from '../../data/boardGeometry'
import SceneLights        from './scene/SceneLights'
import SceneCamera        from './scene/SceneCamera'
import PartRenderer       from './scene/PartRenderer'
import SceneStrip         from './scene/SceneStrip'
import SceneErrorBoundary from './scene/SceneErrorBoundary'
import { CaseModel, CaseGamerModel, CaseProModel, FanModel } from './PartModels'

const CASE_MODELS = {
  'mid-tower':  CaseModel,
  'case-gamer': CaseGamerModel,
  'case-pro':   CaseProModel,
}

const isEmpty = (build) => !build?.cpu && !build?.gpu && !build?.ramSlots?.length

function LoadingPart() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#2a2f3a" wireframe />
    </mesh>
  )
}

function FailedPart() { return null }

export default function PcScene({ build = {}, caseId, selectedCase }) {
  const resolvedCase = caseId ?? selectedCase ?? DEFAULT_CASE
  const config       = CASE_CONFIGS[resolvedCase] ?? CASE_CONFIGS[DEFAULT_CASE]
  const ActiveCase   = CASE_MODELS[resolvedCase] ?? CaseModel
  const boardGeo     = build.motherboard?.id ? BOARD_GEOMETRY[build.motherboard.id] : null

  // Posición y rotación del chasis — campos opcionales, fallback a [0,0,0]
  const casePosition = config.position ?? [0, 0, 0]
  const caseRotation = config.rotation ?? [0, 0, 0]

  // Storage — NVMe va en la board, HDD/SATA va en bahía del chasis
  const storageProduct = build.storageSlots?.[0]?.product ?? null
  const esNvme         = storageProduct?.tipo === 'NVMe'
  const esHdd          = storageProduct && !esNvme

  // RAM resuelta por la board
  const ramResolved = (() => {
    if (!build.ramSlots?.length || !boardGeo) return []
    return build.ramSlots
      .filter(r => r?.product && r.slot <= boardGeo.slotsRam)
      .map(r => {
        const pos = boardGeo.ramSlots?.[r.slot - 1]
        if (!pos) return null
        return { ...r, position: pos }
      })
      .filter(Boolean)
  })()

  return (
    <div className="sidebar-visual-wrap">
      <div className="sidebar-case">

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

            {/* Chasis — position y rotation vienen de caseConfigs */}
            <SceneErrorBoundary fallback={<FailedPart />}>
              <Suspense fallback={<LoadingPart />}>
                <ActiveCase
                  position={casePosition}
                  scale={config.scale}
                  rotation={caseRotation}
                />
              </Suspense>
            </SceneErrorBoundary>

            {config.fan && (
              <SceneErrorBoundary fallback={<FailedPart />}>
                <Suspense fallback={<LoadingPart />}>
                  <FanModel
                    position={config.fan.position}
                    rotation={config.fan.rotation}
                    scale={config.fan.scale}
                  />
                </Suspense>
              </SceneErrorBoundary>
            )}

            {/* Motherboard — posición del chasis + offset propio de la board */}
            {build.motherboard && (
              <SceneErrorBoundary fallback={<FailedPart />}>
                <Suspense fallback={<LoadingPart />}>
                  <PartRenderer
                    type="motherboard"
                    part={build.motherboard}
                    position={[
                      (config.positions.motherboard?.[0] ?? 0) + (boardGeo?.positionOffset?.[0] ?? 0),
                      (config.positions.motherboard?.[1] ?? 0) + (boardGeo?.positionOffset?.[1] ?? 0),
                      (config.positions.motherboard?.[2] ?? 0) + (boardGeo?.positionOffset?.[2] ?? 0),
                    ]}
                    scale={boardGeo?.scale       ?? 0.5}
                    rotation={boardGeo?.rotation ?? [Math.PI / 2, 0, 0]}
                  />
                </Suspense>
              </SceneErrorBoundary>
            )}

            {/* PSU — todo del chasis */}
            {build.psu && (
              <SceneErrorBoundary fallback={<FailedPart />}>
                <Suspense fallback={<LoadingPart />}>
                  <PartRenderer
                    type="psu"
                    part={build.psu}
                    position={config.positions.psu}
                    scale={config.scales.psu}
                    rotation={config.rotations.psu}
                  />
                </Suspense>
              </SceneErrorBoundary>
            )}

            {/* Storage HDD/SATA — bahía del chasis */}
            {esHdd && (
              <SceneErrorBoundary fallback={<FailedPart />}>
                <Suspense fallback={<LoadingPart />}>
                  <PartRenderer
                    type="storage"
                    part={storageProduct}
                    position={config.positions.storageSata ?? config.positions.storage}
                    scale={config.scales.storageSata       ?? config.scales.storage}
                    rotation={config.rotations.storageSata ?? config.rotations.storage}
                  />
                </Suspense>
              </SceneErrorBoundary>
            )}

            {/* Storage NVMe M.2 — ranura en la board */}
            {esNvme && boardGeo?.m2 && (
              <SceneErrorBoundary fallback={<FailedPart />}>
                <Suspense fallback={<LoadingPart />}>
                  <PartRenderer
                    type="storage"
                    part={storageProduct}
                    position={boardGeo.m2.position}
                    scale={boardGeo.m2.scale}
                    rotation={boardGeo.m2.rotation}
                  />
                </Suspense>
              </SceneErrorBoundary>
            )}

            {/* CPU — todo de la board */}
            {build.cpu && boardGeo?.cpu && (
              <SceneErrorBoundary fallback={<FailedPart />}>
                <Suspense fallback={<LoadingPart />}>
                  <PartRenderer
                    type="cpu"
                    part={build.cpu}
                    position={boardGeo.cpu.position}
                    scale={boardGeo.cpu.scale}
                    rotation={boardGeo.cpu.rotation}
                  />
                </Suspense>
              </SceneErrorBoundary>
            )}

            {/* GPU — todo de la board */}
            {build.gpu && boardGeo?.gpu && (
              <SceneErrorBoundary fallback={<FailedPart />}>
                <Suspense fallback={<LoadingPart />}>
                  <PartRenderer
                    type="gpu"
                    part={build.gpu}
                    position={boardGeo.gpu.position}
                    scale={boardGeo.gpu.scale}
                    rotation={boardGeo.gpu.rotation}
                  />
                </Suspense>
              </SceneErrorBoundary>
            )}

            {/* Cooling — todo de la board */}
            {build.cooling && boardGeo?.cooling && (
              <SceneErrorBoundary fallback={<FailedPart />}>
                <Suspense fallback={<LoadingPart />}>
                  <PartRenderer
                    type="cooling"
                    part={build.cooling}
                    position={boardGeo.cooling.position}
                    scale={boardGeo.cooling.scale}
                    rotation={boardGeo.cooling.rotation}
                  />
                </Suspense>
              </SceneErrorBoundary>
            )}

            {/* RAM — posición, scale y rotation de la board */}
            {ramResolved.map(r => (
              <SceneErrorBoundary key={`ram-${r.slot}`} fallback={<FailedPart />}>
                <Suspense fallback={<LoadingPart />}>
                  <PartRenderer
                    type="ram"
                    part={r.product}
                    position={r.position}
                    scale={boardGeo.ramScale}
                    rotation={boardGeo.ramRotation}
                  />
                </Suspense>
              </SceneErrorBoundary>
            ))}

          </Canvas>
        </SceneErrorBoundary>

        {isEmpty(build) && (
          <div className="visual-empty">
            <div className="visual-empty-icon">🖥️</div>
            <div className="visual-empty-text">
              Selecciona componentes para ver el ensamblado 3D
            </div>
          </div>
        )}
      </div>

      <SceneStrip build={{
        ...build,
        ram:     build.ramSlots?.[0]?.product ?? null,
        storage: storageProduct,
      }} />
    </div>
  )
}