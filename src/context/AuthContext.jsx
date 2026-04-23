// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { getUser, getToken, logout as logoutService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => getUser())
  const [token, setToken] = useState(() => getToken())

  const login = (authResponse) => {
    localStorage.setItem('nexus_token', authResponse.token)
    localStorage.setItem('nexus_user', JSON.stringify({
      nombre: authResponse.nombre,
      email:  authResponse.email,
      rol:    authResponse.rol,
    }))
    setToken(authResponse.token)
    setUser({ nombre: authResponse.nombre, email: authResponse.email, rol: authResponse.rol })
  }

  const logout = () => {
    logoutService()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}