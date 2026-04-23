// =============================================
// NEXUS — EspecsGrid
// Responsabilidad única: mostrar specs lado a lado.
// Resalta cuál es mejor en cada fila.
// =============================================

const FILAS = [
  { key: 'pantalla',        label: 'Pantalla'         },
  { key: 'resolucion',      label: 'Resolución'       },
  { key: 'procesador',      label: 'Procesador'       },
  { key: 'ram',             label: 'RAM'              },
  { key: 'almacenamiento',  label: 'Almacenamiento'   },
  { key: 'camaraPrincipal', label: 'Cámara principal' },
  { key: 'camaraFrontal',   label: 'Cámara frontal'   },
  { key: 'bateria',         label: 'Batería'          },
  { key: 'so',              label: 'Sistema operativo'},
  { key: 'tieneNfc',        label: 'NFC'              },
  { key: 'tiene5g',         label: '5G'               },
]

// Determina cuál valor es "mejor" para resaltarlo
// Retorna 'a' | 'b' | null (si son iguales o no aplica)
function ganadorFila(key, specA, specB) {
  const a = specA[key]
  const b = specB[key]

  if (a === b) return null

  // Booleanos: true gana
  if (typeof a === 'boolean') return a ? 'a' : 'b'

  // Extraer número del string para comparar
  const numA = parseFloat(String(a).match(/([\d.]+)/)?.[1] ?? '0')
  const numB = parseFloat(String(b).match(/([\d.]+)/)?.[1] ?? '0')

  if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
    return numA > numB ? 'a' : 'b'
  }

  return null
}

function formatVal(val) {
  if (typeof val === 'boolean') return val ? 'Sí' : 'No'
  return val ?? '—'
}

export default function EspecsGrid({ prodA, prodB, colorA, colorB }) {
  return (
    <div className="specs-grid-wrap">
      {/* Header */}
      <div className="specs-header">
        <div className="specs-col-label" />
        <div className="specs-col-a" style={{ color: colorA }}>
          {prodA.marca} {prodA.modelo}
        </div>
        <div className="specs-col-b" style={{ color: colorB }}>
          {prodB.marca} {prodB.modelo}
        </div>
      </div>

      {/* Precio */}
      <div className="specs-row specs-row-price">
        <div className="specs-col-label">Precio</div>
        <div
          className={`specs-col-a specs-val ${prodA.precio < prodB.precio ? 'specs-winner' : ''}`}
          style={prodA.precio < prodB.precio ? { color: colorA } : {}}
        >
          ${prodA.precio.toLocaleString('es-CO')}
        </div>
        <div
          className={`specs-col-b specs-val ${prodB.precio < prodA.precio ? 'specs-winner' : ''}`}
          style={prodB.precio < prodA.precio ? { color: colorB } : {}}
        >
          ${prodB.precio.toLocaleString('es-CO')}
        </div>
      </div>

      {/* Specs */}
      {FILAS.map(fila => {
        const ganador = ganadorFila(fila.key, prodA.specs, prodB.specs)
        return (
          <div key={fila.key} className="specs-row">
            <div className="specs-col-label">{fila.label}</div>
            <div
              className={`specs-col-a specs-val ${ganador === 'a' ? 'specs-winner' : ''}`}
              style={ganador === 'a' ? { color: colorA } : {}}
            >
              {formatVal(prodA.specs[fila.key])}
            </div>
            <div
              className={`specs-col-b specs-val ${ganador === 'b' ? 'specs-winner' : ''}`}
              style={ganador === 'b' ? { color: colorB } : {}}
            >
              {formatVal(prodB.specs[fila.key])}
            </div>
          </div>
        )
      })}
    </div>
  )
}
