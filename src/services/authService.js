// =============================================
// NEXUS — AUTH SERVICE
// USE_MOCK = true  → localStorage (sin backend)
// USE_MOCK = false → Spring Boot
// =============================================

const USE_MOCK = true
const API_BASE = 'http://localhost:8080/api'

const KEY_TOKEN = 'nexus_token'
const KEY_USER  = 'nexus_user'
const KEY_USERS = 'nexus_users'

// Usuario admin por defecto — solo en mock
const DEFAULT_ADMIN = {
  id:       'admin-001',
  nombre:   'Administrador',
  email:    'admin@nexus.com',
  password: 'admin123',
  rol:      'ROLE_ADMIN',
}

function getStoredUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(KEY_USERS) || '[]')
    // Inyecta el admin si no existe aún
    if (!users.find(u => u.id === DEFAULT_ADMIN.id)) {
      const withAdmin = [DEFAULT_ADMIN, ...users]
      localStorage.setItem(KEY_USERS, JSON.stringify(withAdmin))
      return withAdmin
    }
    return users
  } catch {
    return [DEFAULT_ADMIN]
  }
}

export async function register({ nombre, email, password }) {
  if (USE_MOCK) {
    const users = getStoredUsers()
    if (users.find(u => u.email === email))
      throw new Error('El correo ya está registrado.')
    const user = { id: `user-${Date.now()}`, nombre, email, password, rol: 'ROLE_USER' }
    localStorage.setItem(KEY_USERS, JSON.stringify([...users, user]))
    const session = { id: user.id, nombre, email, rol: user.rol }
    localStorage.setItem(KEY_TOKEN, 'mock-token-' + user.id)
    localStorage.setItem(KEY_USER,  JSON.stringify(session))
    return { token: 'mock-token-' + user.id, user: session }
  }
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password }),
  })
  if (!res.ok) throw new Error(await res.text() || 'Error al registrarse')
  const data = await res.json()
  localStorage.setItem(KEY_TOKEN, data.token)
  localStorage.setItem(KEY_USER,  JSON.stringify(data.user))
  return data
}

export async function login(credentials, passwordArg) {
  const normalized = (credentials && typeof credentials === 'object' && !Array.isArray(credentials))
    ? credentials
    : { email: credentials, password: passwordArg }

  const { email, password } = normalized

  if (USE_MOCK) {
    const users = getStoredUsers()
    const user  = users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Correo o contraseña incorrectos.')
    const session = { id: user.id, nombre: user.nombre, email, rol: user.rol }
    localStorage.setItem(KEY_TOKEN, 'mock-token-' + user.id)
    localStorage.setItem(KEY_USER,  JSON.stringify(session))
    return { token: 'mock-token-' + user.id, user: session }
  }
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await res.text() || 'Credenciales incorrectas')
  const data = await res.json()
  localStorage.setItem(KEY_TOKEN, data.token)
  localStorage.setItem(KEY_USER,  JSON.stringify(data.user))
  return data
}

export function logout() {
  localStorage.removeItem(KEY_TOKEN)
  localStorage.removeItem(KEY_USER)
}

export function getToken()  { return localStorage.getItem(KEY_TOKEN) }

export function getUser() {
  try { return JSON.parse(localStorage.getItem(KEY_USER)) }
  catch { return null }
}

export function getCurrentUser() { return getUser() }
export function isAuthenticated() { return !!getToken() }