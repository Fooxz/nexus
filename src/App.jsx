import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home      from './pages/Home'
import PcBuilder from './pages/PcBuilder'
import Login     from './pages/Login'
import Register  from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route
          path="/pc-builder"
          element={
            <ProtectedRoute>
              <PcBuilder />
            </ProtectedRoute>
          }
        />
        <Route path="/login"       element={<Login />} />
        <Route path="/register"    element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}