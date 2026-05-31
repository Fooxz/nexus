// =============================================
// NEXUS — ADMIN SERVICE
// USE_MOCK = true  → localStorage
// USE_MOCK = false → Spring Boot
// Gestiona productos, pedidos y usuarios desde el admin.
// =============================================

const USE_MOCK   = true
const API_BASE   = 'http://localhost:8080/api/admin'

const KEY_PRODUCTOS = 'nexus_admin_productos'
const KEY_PEDIDOS   = 'nexus_pedidos'
const KEY_USERS     = 'nexus_users'

/* ── helpers mock ── */
function loadKey(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)) }
  catch { return fallback }
}
function saveKey(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}
function genId(prefix = 'prod') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`
}

/* ══════════════════════════════════════════
   PRODUCTOS
══════════════════════════════════════════ */

export async function getProductosAdmin() {
  if (USE_MOCK) {
    // Si no hay productos admin aún, cargamos los mock como base
    const stored = loadKey(KEY_PRODUCTOS, null)
    if (stored !== null) return stored
    // Primera vez: importa los mock y los guarda
    const { PC_PARTS } = await import('../data/mockComponentesPc')
    const { CELULARES } = await import('../data/mockCelulares')
    const LABELS = {
      cpu:'CPU', gpu:'GPU', ram:'RAM', motherboard:'Motherboard',
      storage:'Almacenamiento', psu:'Fuente', case:'Gabinete', cooling:'Refrigeración',
    }
    const pcFlat = Object.entries(PC_PARTS).flatMap(([cat, items]) =>
      items.map(p => ({ ...p, categoria: LABELS[cat] ?? cat, activo: true }))
    )
    const celFlat = CELULARES.map(c => ({
      id: c.id, nombre: `${c.marca} ${c.modelo}`,
      marca: c.marca, precio: c.precio,
      precioNormal: c.precioNormal, descuento: c.descuento ?? 0,
      imagen: c.imagen, categoria: 'Celular',
      descripcion: '', activo: true,
    }))
    const todos = [...pcFlat, ...celFlat]
    saveKey(KEY_PRODUCTOS, todos)
    return todos
  }
  const res = await fetch(`${API_BASE}/productos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('nexus_token')}` }
  })
  if (!res.ok) throw new Error('Error al obtener productos')
  return res.json()
}

export async function crearProducto(datos) {
  if (USE_MOCK) {
    const productos = loadKey(KEY_PRODUCTOS, [])
    const nuevo = { ...datos, id: genId('prod'), activo: true }
    saveKey(KEY_PRODUCTOS, [...productos, nuevo])
    return nuevo
  }
  const res = await fetch(`${API_BASE}/productos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('nexus_token')}`,
    },
    body: JSON.stringify(datos),
  })
  if (!res.ok) throw new Error('Error al crear producto')
  return res.json()
}

export async function actualizarProducto(id, datos) {
  if (USE_MOCK) {
    const productos = loadKey(KEY_PRODUCTOS, [])
    const actualizados = productos.map(p => p.id === id ? { ...p, ...datos } : p)
    saveKey(KEY_PRODUCTOS, actualizados)
    return actualizados.find(p => p.id === id)
  }
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('nexus_token')}`,
    },
    body: JSON.stringify(datos),
  })
  if (!res.ok) throw new Error('Error al actualizar producto')
  return res.json()
}

export async function eliminarProducto(id) {
  if (USE_MOCK) {
    const productos = loadKey(KEY_PRODUCTOS, [])
    saveKey(KEY_PRODUCTOS, productos.filter(p => p.id !== id))
    return { ok: true }
  }
  const res = await fetch(`${API_BASE}/productos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('nexus_token')}` },
  })
  if (!res.ok) throw new Error('Error al eliminar producto')
  return { ok: true }
}

/* ══════════════════════════════════════════
   PEDIDOS
══════════════════════════════════════════ */

export async function getPedidos() {
  if (USE_MOCK) {
    return loadKey(KEY_PEDIDOS, [])
  }
  const res = await fetch(`${API_BASE}/pedidos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('nexus_token')}` }
  })
  if (!res.ok) throw new Error('Error al obtener pedidos')
  return res.json()
}

/* ══════════════════════════════════════════
   USUARIOS
══════════════════════════════════════════ */

export async function getUsuarios() {
  if (USE_MOCK) {
    const users = loadKey(KEY_USERS, [])
    // No exponer passwords
    return users.map(({ password, ...u }) => u)
  }
  const res = await fetch(`${API_BASE}/usuarios`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('nexus_token')}` }
  })
  if (!res.ok) throw new Error('Error al obtener usuarios')
  return res.json()
}

/* ══════════════════════════════════════════
   STATS (derivadas de los datos mock)
══════════════════════════════════════════ */

export async function getStats() {
  if (USE_MOCK) {
    const productos = await getProductosAdmin()
    const pedidos   = await getPedidos()
    const usuarios  = await getUsuarios()

    const ingresos  = pedidos.reduce((acc, p) => acc + (p.total ?? 0), 0)
    const hoy       = new Date().toDateString()
    const pedidosHoy = pedidos.filter(p =>
      new Date(p.fecha ?? p.savedAt ?? 0).toDateString() === hoy
    ).length

    // Categorías más populares
    const catCount = {}
    productos.forEach(p => {
      catCount[p.categoria] = (catCount[p.categoria] ?? 0) + 1
    })
    const categorias = Object.entries(catCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nombre, total]) => ({ nombre, total }))

    return {
      totalProductos: productos.length,
      totalPedidos:   pedidos.length,
      totalUsuarios:  usuarios.length,
      ingresos,
      pedidosHoy,
      categorias,
    }
  }
  const res = await fetch(`${API_BASE}/stats`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('nexus_token')}` }
  })
  if (!res.ok) throw new Error('Error al obtener estadísticas')
  return res.json()
}