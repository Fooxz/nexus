// =============================================
// NEXUS — COMPARADOR SERVICE
// Responsabilidad única: lógica pura de comparación.
// Scores absolutos basados en topes del mercado actual.
// =============================================

// ── Tabla de scores de procesador (mayor = mejor) ──────────
const PROCESSOR_SCORES = {
  // Apple
  'apple a19 pro':      100,
  'apple a18':          98,
  'apple a17 pro':      99,
  'apple a16 bionic':   97,
  'apple a13 bionic':   95,
  'apple a12 bionic':   88,
  'apple a11 bionic':   82,
  'apple a10 fusion':   72,
  'apple a9':           62,
  'apple a8':           50,
  // Qualcomm
  'snapdragon 8 elite': 99,
  'snapdragon 8 gen 3': 98,
  'snapdragon 865':     94,
  'snapdragon 855+':    90,
  'snapdragon 855':     88,
  'snapdragon 845':     80,
  'snapdragon 835':     74,
  'snapdragon 821':     68,
  'snapdragon 820':     66,
  'snapdragon 730g':    72,
  'snapdragon 730':     70,
  'snapdragon 720g':    68,
  'snapdragon 675':     62,
  'snapdragon 670':     60,
  'snapdragon 665':     58,
  'snapdragon 632':     52,
  'snapdragon 630':     50,
  'snapdragon 625':     48,
  'snapdragon 450':     38,
  'snapdragon 439':     35,
  'snapdragon 430':     32,
  // Google
  'google tensor g5':   96,
  // Kirin
  'kirin 990 5g':       92,
  'kirin 980':          82,
  'kirin 710f':         58,
  'kirin 710':          56,
  // Exynos
  'exynos 990':         91,
  'exynos 9825':        86,
  'exynos 9820':        84,
  'exynos 9810':        78,
  'exynos 8895':        74,
  'exynos 9611':        62,
  'exynos 9609':        60,
  // MediaTek
  'helio g90t':         70,
  'helio g70':          58,
  'helio p70':          54,
  'helio p35':          42,
  'helio p22':          36,
  'helio a22':          30,
}

function getProcessorScore(procesador) {
  if (!procesador) return 40
  const key = procesador.toLowerCase()
  for (const [name, score] of Object.entries(PROCESSOR_SCORES)) {
    if (key.includes(name)) return score
  }
  return 40
}

// ── Calificadores absolutos por eje ────────────────────────

function calificarPantallaAbsoluta(resStr) {
  if (!resStr) return 40
  const parts = resStr.toLowerCase().split('x').map(Number)
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return 50
  const pixelesTotales = parts[0] * parts[1]
  const MAX_PIXELES_MERCADO = 4500000
  let score = Math.round((pixelesTotales / MAX_PIXELES_MERCADO) * 100)
  return Math.min(Math.max(score, 10), 100)
}

function calificarBateriaAbsoluta(bateriaStr) {
  if (!bateriaStr) return 40
  const match = bateriaStr.match(/(\d+)/)
  const mah = match ? parseInt(match[1], 10) : 0
  if (mah === 0) return 40
  const TOP_BATERIA = 5000
  let score = Math.round((mah / TOP_BATERIA) * 100)
  return Math.min(Math.max(score, 15), 100)
}

function calificarCamaraAbsoluta(camaraStr, productoMarca) {
  if (!camaraStr) return 30
  const nums = camaraStr.match(/\d+/g)
  if (!nums) return 40
  const mpMaximos = Math.max(...nums.map(Number))
  let scoreBase = 40
  if (mpMaximos >= 200)      scoreBase = 90
  else if (mpMaximos >= 108) scoreBase = 85
  else if (mpMaximos >= 50)  scoreBase = 78
  else if (mpMaximos >= 48)  scoreBase = 75
  else if (mpMaximos >= 12)  scoreBase = 55
  const marca = (productoMarca ?? '').toLowerCase()
  if (marca.includes('apple') || marca.includes('samsung')) scoreBase += 8
  const texto = camaraStr.toLowerCase()
  if (texto.includes('triple') || texto.includes('cuádruple') || texto.includes('quad')) scoreBase += 10
  else if (texto.includes('dual')) scoreBase += 4
  return Math.min(scoreBase, 100)
}

function calificarMemoriaAbsoluta(ramStr, storageStr) {
  const matchRam = ramStr ? ramStr.match(/(\d+)/) : null
  const ram = matchRam ? parseInt(matchRam[1], 10) : 4
  const matchStorage = storageStr ? storageStr.match(/(\d+)/) : null
  const storage = matchStorage ? parseInt(matchStorage[1], 10) : 64
  const scoreRam     = (ram / 16) * 100
  const scoreStorage = (storage / 512) * 100
  let scoreTotal = Math.round((scoreRam * 0.6) + (scoreStorage * 0.4))
  return Math.min(Math.max(scoreTotal, 20), 100)
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

// ── Parsear megapíxeles del string de cámara ────────────────
function parseMegapixels(camaraStr) {
  if (!camaraStr) return 0
  const nums = camaraStr.match(/\d+/g)
  if (!nums) return 0
  return Math.max(...nums.map(Number))
}

// ── Parsear tamaño de pantalla ──────────────────────────────
function parsePantalla(pantallaStr) {
  if (!pantallaStr) return 0
  const match = pantallaStr.match(/([\d.]+)/)
  return match ? parseFloat(match[1]) : 0
}

// ── Extraer métricas crudas de un producto ──────────────────
function extraerMetricas(producto) {
  const s = producto.specs ?? producto
  return {
    rendimiento:     getProcessorScore(s.procesador),
    camaraPrincipal: parseMegapixels(s.camaraPrincipal),
    camaraFrontal:   parseMegapixels(s.camaraFrontal),
    bateria:         parseBateria(s.bateria),
    ram:             parseRam(s.ram),
    storage:         parseStorage(s.almacenamiento),
    pantallaTam:     parsePantalla(s.pantalla),
    precio:          producto.precio ?? producto.producto?.precio,
  }
}

// ── Calcular scores del radar con valores absolutos ─────────
export function calcularScoresRadar(prodA, prodB) {
  const sA = prodA.specs ?? prodA
  const sB = prodB.specs ?? prodB
  const mA = extraerMetricas(prodA)
  const mB = extraerMetricas(prodB)

  // 1. Rendimiento — directo de PROCESSOR_SCORES (escala 30-100)
  const rendimiento = {
    a: getProcessorScore(sA.procesador),
    b: getProcessorScore(sB.procesador),
  }

  // 2. Pantalla — basado en resolución total vs tope mercado
  const pantalla = {
    a: calificarPantallaAbsoluta(sA.resolucion),
    b: calificarPantallaAbsoluta(sB.resolucion),
  }

  // 3. Cámaras — escala con bonus por marca y versatilidad
  const camaras = {
    a: calificarCamaraAbsoluta(sA.camaraPrincipal, prodA.marca),
    b: calificarCamaraAbsoluta(sB.camaraPrincipal, prodB.marca),
  }

  // 4. Batería — mAh vs tope 5000 mAh
  const bateria = {
    a: calificarBateriaAbsoluta(sA.bateria, mA.rendimiento),
    b: calificarBateriaAbsoluta(sB.bateria, mB.rendimiento),
  }

  // 5. Memoria — RAM + almacenamiento ponderados
  const memoria = {
    a: calificarMemoriaAbsoluta(sA.ram, sA.almacenamiento),
    b: calificarMemoriaAbsoluta(sB.ram, sB.almacenamiento),
  }

  // 6. Valor — el producto más caro obtiene mayor score
  const peorPrecio = Math.max(mA.precio, mB.precio)
  const valorA = peorPrecio === mA.precio ? 100 : Math.round((mA.precio / peorPrecio) * 100)
  const valorB = peorPrecio === mB.precio ? 100 : Math.round((mB.precio / peorPrecio) * 100)
  const valor = {
    a: Math.min(valorA, 100),
    b: Math.min(valorB, 100),
  }

  return { rendimiento, pantalla, camaras, bateria, memoria, valor }
}

// ── Calcular ventajas de A sobre B ─────────────────────────
export function calcularVentajas(prodA, prodB) {
  const mA = extraerMetricas(prodA)
  const mB = extraerMetricas(prodB)
  const sA = prodA.specs ?? prodA
  const sB = prodB.specs ?? prodB
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
      labelA: sA.ram, labelB: sB.ram,
      umbral: 0,
    },
    {
      campo: 'Cámara principal',
      a: mA.camaraPrincipal, b: mB.camaraPrincipal,
      labelA: sA.camaraPrincipal, labelB: sB.camaraPrincipal,
      umbral: 5,
    },
    {
      campo: 'Cámara frontal',
      a: mA.camaraFrontal, b: mB.camaraFrontal,
      labelA: sA.camaraFrontal, labelB: sB.camaraFrontal,
      umbral: 5,
    },
    {
      campo: 'Rendimiento del procesador',
      a: mA.rendimiento, b: mB.rendimiento,
      labelA: sA.procesador, labelB: sB.procesador,
      umbral: 5,
    },
    {
      campo: 'Almacenamiento',
      a: mA.storage, b: mB.storage,
      labelA: sA.almacenamiento, labelB: sB.almacenamiento,
      umbral: 0,
    },
    {
      campo: 'Pantalla',
      a: mA.pantallaTam, b: mB.pantallaTam,
      labelA: sA.pantalla, labelB: sB.pantalla,
      umbral: 2,
    },
    {
      campo: 'Precio',
      a: mB.precio, b: mA.precio,
      labelA: `$${(mA.precio ?? 0).toLocaleString('es-CO')}`,
      labelB: `$${(mB.precio ?? 0).toLocaleString('es-CO')}`,
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
      campo:     c.campo,
      labelA:    c.labelA,
      labelB:    c.labelB,
      pct:       diff,
      ganador,
      invertido: c.invertido ?? false,
    })
  }

  return ventajas.sort((a, b) => b.pct - a.pct)
}

// ── Score global absoluto ponderado (0-100) ─────────────────
export function calcularScoreAbsoluto(producto) {
  const s = producto.specs ?? producto
  const rendimiento = getProcessorScore(s.procesador)
  const pantalla    = calificarPantallaAbsoluta(s.resolucion)
  const camaras     = calificarCamaraAbsoluta(s.camaraPrincipal, producto.marca)
  const bateria     = calificarBateriaAbsoluta(s.bateria, rendimiento)
  const memoria     = calificarMemoriaAbsoluta(s.ram, s.almacenamiento)
  const precio      = producto.precio ?? producto.producto?.precio ?? 0
  const valor       = Math.min(100, Math.max(0, Math.round(((6000000 - precio) / 6000000) * 100)))

  return Math.round(
    rendimiento * 0.35 +
    camaras     * 0.25 +
    pantalla    * 0.10 +
    bateria     * 0.10 +
    memoria     * 0.10 +
    valor       * 0.10
  )
}

export function calcularScoreGlobal(producto) {
  return calcularScoreAbsoluto(producto)
}