// =============================================
// NEXUS — COMPARADOR SERVICE
// Responsabilidad única: lógica pura de comparación.
// Recibe dos productos, devuelve scores, ventajas y ejes del radar.
// Sin React, sin UI, sin efectos secundarios.
// =============================================

// ── Tabla de scores de procesador (mayor = mejor) ──────────
const PROCESSOR_SCORES = {
  // Apple
  'apple a13 bionic': 95,
  'apple a12 bionic': 88,
  'apple a11 bionic': 82,
  'apple a10 fusion': 72,
  'apple a9':         62,
  'apple a8':         50,
  // Qualcomm
  'snapdragon 865':   94,
  'snapdragon 855+':  90,
  'snapdragon 855':   88,
  'snapdragon 845':   80,
  'snapdragon 835':   74,
  'snapdragon 821':   68,
  'snapdragon 820':   66,
  'snapdragon 730g':  72,
  'snapdragon 730':   70,
  'snapdragon 720g':  68,
  'snapdragon 675':   62,
  'snapdragon 670':   60,
  'snapdragon 665':   58,
  'snapdragon 632':   52,
  'snapdragon 630':   50,
  'snapdragon 625':   48,
  'snapdragon 450':   38,
  'snapdragon 439':   35,
  'snapdragon 430':   32,
  // Kirin
  'kirin 990 5g':     92,
  'kirin 980':        82,
  'kirin 710f':       58,
  'kirin 710':        56,
  // Exynos
  'exynos 990':       91,
  'exynos 9825':      86,
  'exynos 9820':      84,
  'exynos 9810':      78,
  'exynos 8895':      74,
  'exynos 9611':      62,
  'exynos 9609':      60,
  // MediaTek
  'helio g90t':       70,
  'helio g70':        58,
  'helio p70':        54,
  'helio p35':        42,
  'helio p22':        36,
  'helio a22':        30,
}

function getProcessorScore(procesador) {
  if (!procesador) return 40
  const key = procesador.toLowerCase()
  for (const [name, score] of Object.entries(PROCESSOR_SCORES)) {
    if (key.includes(name)) return score
  }
  return 40
}

// ── Parsear megapíxeles del string de cámara ────────────────
function parseMegapixels(camaraStr) {
  if (!camaraStr) return 0
  const nums = camaraStr.match(/\d+/g)
  if (!nums) return 0
  return Math.max(...nums.map(Number))
}

// ── Parsear mAh ────────────────────────────────────────────
function parseBateria(bateriaStr) {
  if (!bateriaStr) return 0
  const match = bateriaStr.match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

// ── Parsear RAM en GB ───────────────────────────────────────
function parseRam(ramStr) {
  if (!ramStr) return 0
  const match = ramStr.match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

// ── Parsear almacenamiento en GB ────────────────────────────
function parseStorage(storageStr) {
  if (!storageStr) return 0
  const match = storageStr.match(/(\d+)/)
  return match ? parseInt(match[1]) : 0
}

// ── Parsear resolución total en píxeles ─────────────────────
function parseResolucion(resStr) {
  if (!resStr) return 0
  const parts = resStr.split('x').map(Number)
  if (parts.length < 2) return 0
  return parts[0] * parts[1]
}

// ── Parsear tamaño de pantalla ──────────────────────────────
function parsePantalla(pantallaStr) {
  if (!pantallaStr) return 0
  const match = pantallaStr.match(/([\d.]+)/)
  return match ? parseFloat(match[1]) : 0
}

// ── Normalizar valor entre 0-100 dado un rango ─────────────
function normalizar(valor, min, max) {
  if (max === min) return 50
  return Math.round(((valor - min) / (max - min)) * 100)
}

// ── Extraer métricas crudas de un producto ──────────────────
function extraerMetricas(producto) {
  const s = producto.specs
  return {
    rendimiento:    getProcessorScore(s.procesador),
    resolucion:     parseResolucion(s.resolucion),
    pantallaTam:    parsePantalla(s.pantalla),
    camaraPrincipal: parseMegapixels(s.camaraPrincipal),
    camaraFrontal:  parseMegapixels(s.camaraFrontal),
    bateria:        parseBateria(s.bateria),
    ram:            parseRam(s.ram),
    storage:        parseStorage(s.almacenamiento),
    precio:         producto.precio,
  }
}

// ── Calcular score de cada eje del radar (0-100) ────────────
// Normaliza contra los dos productos para que siempre haya contraste.
export function calcularScoresRadar(prodA, prodB) {
  const mA = extraerMetricas(prodA)
  const mB = extraerMetricas(prodB)

  function scoreEje(valA, valB) {
    const min = Math.min(valA, valB)
    const max = Math.max(valA, valB)
    return {
      a: normalizar(valA, min, max),
      b: normalizar(valB, min, max),
    }
  }

  // Rendimiento — processor score
  const rendimiento = scoreEje(mA.rendimiento, mB.rendimiento)

  // Pantalla — combinación de resolución + tamaño
  const pantallaA = mA.resolucion / 100000 + mA.pantallaTam * 10
  const pantallaB = mB.resolucion / 100000 + mB.pantallaTam * 10
  const pantalla  = scoreEje(pantallaA, pantallaB)

  // Cámaras — principal pesada más que frontal
  const camaraA = mA.camaraPrincipal * 0.7 + mA.camaraFrontal * 0.3
  const camaraB = mB.camaraPrincipal * 0.7 + mB.camaraFrontal * 0.3
  const camaras  = scoreEje(camaraA, camaraB)

  // Batería — mAh directo
  const bateria = scoreEje(mA.bateria, mB.bateria)

  // Memoria — RAM (peso mayor) + storage
  const memoriaA = mA.ram * 8 + mA.storage
  const memoriaB = mB.ram * 8 + mB.storage
  const memoria   = scoreEje(memoriaA, memoriaB)

  // Valor — specs totales por peso en precio
  // Un score alto = más specs por cada peso colombiano
  const specsA = mA.rendimiento + mA.camaraPrincipal + mA.bateria / 50 + mA.ram * 5
  const specsB = mB.rendimiento + mB.camaraPrincipal + mB.bateria / 50 + mB.ram * 5
  const valorA = specsA / (mA.precio / 100000)
  const valorB = specsB / (mB.precio / 100000)
  const valor   = scoreEje(valorA, valorB)

  return {
    rendimiento,
    pantalla,
    camaras,
    bateria,
    memoria,
    valor,
  }
}

// ── Calcular ventajas de A sobre B (y viceversa) ────────────
// Retorna array de { campo, labelA, labelB, pct, ganador: 'a'|'b' }
export function calcularVentajas(prodA, prodB) {
  const mA = extraerMetricas(prodA)
  const mB = extraerMetricas(prodB)
  const ventajas = []

  function pctDiff(a, b) {
    if (b === 0) return 0
    return Math.round(((a - b) / b) * 100)
  }

  const comparaciones = [
    {
      campo: 'Batería',
      a: mA.bateria, b: mB.bateria,
      labelA: `${mA.bateria} mAh`, labelB: `${mB.bateria} mAh`,
      umbral: 3,
    },
    {
      campo: 'RAM',
      a: mA.ram, b: mB.ram,
      labelA: prodA.specs.ram, labelB: prodB.specs.ram,
      umbral: 0,
    },
    {
      campo: 'Cámara principal',
      a: mA.camaraPrincipal, b: mB.camaraPrincipal,
      labelA: prodA.specs.camaraPrincipal, labelB: prodB.specs.camaraPrincipal,
      umbral: 5,
    },
    {
      campo: 'Cámara frontal',
      a: mA.camaraFrontal, b: mB.camaraFrontal,
      labelA: prodA.specs.camaraFrontal, labelB: prodB.specs.camaraFrontal,
      umbral: 5,
    },
    {
      campo: 'Rendimiento del procesador',
      a: mA.rendimiento, b: mB.rendimiento,
      labelA: prodA.specs.procesador, labelB: prodB.specs.procesador,
      umbral: 5,
    },
    {
      campo: 'Almacenamiento',
      a: mA.storage, b: mB.storage,
      labelA: prodA.specs.almacenamiento, labelB: prodB.specs.almacenamiento,
      umbral: 0,
    },
    {
      campo: 'Pantalla',
      a: mA.pantallaTam, b: mB.pantallaTam,
      labelA: prodA.specs.pantalla, labelB: prodB.specs.pantalla,
      umbral: 3,
    },
    {
      campo: 'Precio',
      a: mB.precio, b: mA.precio, // invertido: menor precio = ventaja
      labelA: `$${mA.precio.toLocaleString('es-CO')}`,
      labelB: `$${mB.precio.toLocaleString('es-CO')}`,
      umbral: 3,
      invertido: true,
    },
  ]

  for (const c of comparaciones) {
    if (c.a === c.b) continue
    const diff = Math.abs(pctDiff(c.a, c.b))
    if (diff < c.umbral) continue

    const ganador = c.a > c.b ? 'a' : 'b'
    ventajas.push({
      campo:   c.campo,
      labelA:  c.labelA,
      labelB:  c.labelB,
      pct:     diff,
      ganador,
      invertido: c.invertido ?? false,
    })
  }

  // Ordenar por diferencia porcentual descendente
  return ventajas.sort((a, b) => b.pct - a.pct)
}

// ── Score global (0-100) para mostrar debajo del radar ──────
export function calcularScoreGlobal(producto, oponente) {
  const scores = calcularScoresRadar(producto, oponente)
  const ejes   = Object.values(scores).map(e => e.a)
  return Math.round(ejes.reduce((s, v) => s + v, 0) / ejes.length)
}
