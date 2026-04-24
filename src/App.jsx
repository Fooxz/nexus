import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home       from './pages/Home'
import PcBuilder  from './pages/PcBuilder'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Productos  from './pages/Productos'
import Carrito    from './pages/Carrito'
import Comparador from './pages/Comparador'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/productos"  element={<Productos />} />
        <Route path="/carrito"    element={<Carrito />} />
        <Route path="/comparador" element={<Comparador />} />
        <Route
          path="/pc-builder"
          element={
            <ProtectedRoute>
              <PcBuilder />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}