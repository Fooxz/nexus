// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }    from './context/AuthContext'
import { CartProvider }    from './context/CartContext'

// Páginas públicas / usuario
import Home            from './pages/Home'
import Login           from './pages/Login'
import Register        from './pages/Register'
import ComparadorPage  from './pages/ComparadorPage'
import Productos       from './pages/Productos'
import ProductoDetalle from './pages/ProductoDetalle'
import Carrito         from './pages/Carrito'
import PcBuilder       from './pages/PcBuilder'

// Páginas admin
import AdminDashboard  from './pages/admin/AdminDashboard'
import AdminProductos  from './pages/admin/AdminProductos'
import AdminPedidos    from './pages/admin/AdminPedidos'
import AdminUsuarios   from './pages/admin/AdminUsuarios'

import ProtectedRoute  from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Públicas ── */}
            <Route path="/"              element={<Home />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/register"      element={<Register />} />
            <Route path="/comparador"    element={<ComparadorPage />} />
            <Route path="/productos"     element={<Productos />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} />
            <Route path="/carrito"       element={<Carrito />} />

            {/* ── Protegida usuario ── */}
            <Route
              path="/pc-builder"
              element={
                <ProtectedRoute>
                  <PcBuilder />
                </ProtectedRoute>
              }
            />

            {/* ── Protegidas admin ── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/productos"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <AdminProductos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pedidos"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <AdminPedidos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <ProtectedRoute requiredRole="ROLE_ADMIN">
                  <AdminUsuarios />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}