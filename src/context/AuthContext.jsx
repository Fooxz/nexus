// =============================================
// NEXUS — AuthContext
// Responsabilidad única: estado global de sesión.
// =============================================
import { createContext, useContext, useState } from 'react'
import { getUser, getToken, logout as logoutService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => getUser())
  const [token, setToken] = useState(() => getToken())

  // authResponse puede ser { token, user } (nuevo authService)
  // o { token, nombre, email, rol } (formato legado)
  const login = (authResponse) => {
    const userData = authResponse.user ?? {
      nombre: authResponse.nombre,
      email:  authResponse.email,
      rol:    authResponse.rol,
    }
    localStorage.setItem('nexus_token', authResponse.token)
    localStorage.setItem('nexus_user',  JSON.stringify(userData))
    setToken(authResponse.token)
    setUser(userData)
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