// =============================================
// NEXUS — AUTH SERVICE
// USE_MOCK = true  → localStorage (prototipo)
// USE_MOCK = false → Spring Boot
// =============================================

const USE_MOCK = true
const API_BASE = 'http://localhost:8080/api'

const STORAGE_KEY_TOKEN = 'nexus_token'
const STORAGE_KEY_USER  = 'nexus_user'
const STORAGE_KEY_USERS = 'nexus_users'

// ── Helpers mock ──────────────────────────────
function getStoredUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]') }
  catch { return [] }
}

// ── Register ──────────────────────────────────
export async function register({ nombre, email, password }) {
  if (USE_MOCK) {
    const users = getStoredUsers()
    if (users.find(u => u.email === email)) {
      throw new Error('El correo ya está registrado.')
    }
    const user = { id: `user-${Date.now()}`, nombre, email, password, rol: 'ROLE_USER' }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([...users, user]))
    const session = { id: user.id, nombre, email, rol: user.rol }
    localStorage.setItem(STORAGE_KEY_TOKEN, 'mock-token-' + user.id)
    localStorage.setItem(STORAGE_KEY_USER,  JSON.stringify(session))
    return { token: 'mock-token-' + user.id, user: session }
  }

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password }),
  })
  if (!res.ok) throw new Error(await res.text() || 'Error al registrarse')
  const data = await res.json()
  localStorage.setItem(STORAGE_KEY_TOKEN, data.token)
  localStorage.setItem(STORAGE_KEY_USER,  JSON.stringify(data.user))
  return data
}

// ── Login ─────────────────────────────────────
export async function login({ email, password }) {
  if (USE_MOCK) {
    const users = getStoredUsers()
    const user  = users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Correo o contraseña incorrectos.')
    const session = { id: user.id, nombre: user.nombre, email, rol: user.rol }
    localStorage.setItem(STORAGE_KEY_TOKEN, 'mock-token-' + user.id)
    localStorage.setItem(STORAGE_KEY_USER,  JSON.stringify(session))
    return { token: 'mock-token-' + user.id, user: session }
  }

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await res.text() || 'Credenciales incorrectas')
  const data = await res.json()
  localStorage.setItem(STORAGE_KEY_TOKEN, data.token)
  localStorage.setItem(STORAGE_KEY_USER,  JSON.stringify(data.user))
  return data
}

// ── Logout ────────────────────────────────────
export function logout() {
  localStorage.removeItem(STORAGE_KEY_TOKEN)
  localStorage.removeItem(STORAGE_KEY_USER)
}

// ── Getters ───────────────────────────────────
export function getToken() {
  return localStorage.getItem(STORAGE_KEY_TOKEN)
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_USER)) }
  catch { return null }
}

export function isAuthenticated() {
  return !!getToken()
}

export function getCurrentUser() {
  return getUser()
}