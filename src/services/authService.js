// src/services/authService.js
// Responsabilidad única: comunicación con los endpoints de autenticación.
// USE_MOCK = true mientras el back no esté listo
// USE_MOCK = false cuando conectes Spring Boot

const USE_MOCK = false  // ← ya tenemos el backend listo
const API_BASE = 'http://localhost:8080/api'

export async function register(nombre, email, password) {
  if (USE_MOCK) {
    return { token: 'mock-token', nombre, email, rol: 'ROLE_USER' }
  }
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password })
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Error al registrarse')
  }
  return res.json()
}
 
export async function login(email, password) {
  if (USE_MOCK) {
    return { token: 'mock-token', nombre: 'Eric', email, rol: 'ROLE_USER' }
  }
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || 'Credenciales incorrectas')
  }
  return res.json()
}

export function logout() {
  localStorage.removeItem('nexus_token')
  localStorage.removeItem('nexus_user')
}

export function getToken() {
  return localStorage.getItem('nexus_token')
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('nexus_user'))
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return !!getToken()
}