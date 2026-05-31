// src/components/ProtectedRoute.jsx
// Protege rutas por autenticación y opcionalmente por rol.
// requiredRole: 'ROLE_ADMIN' | 'ROLE_USER' | undefined

import { Navigate } from 'react-router-dom'
import { useAuth }  from '../context/AuthContext'

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.rol !== requiredRole) {
    // Usuario logueado pero sin el rol requerido
    return <Navigate to="/" replace />
  }

  return children
}