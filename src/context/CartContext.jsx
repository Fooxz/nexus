// =============================================
// NEXUS — CartContext
// Responsabilidad única: estado global del carrito.
// Persiste en localStorage. No requiere login para agregar.
// El login se exige solo al confirmar compra.
// =============================================
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'nexus_cart'

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart())

  useEffect(() => {
    saveCart(items)
  }, [items])

  const agregar = (producto) => {
    setItems(prev => {
      const existe = prev.find(i => i.id === producto.id)
      if (existe) {
        return prev.map(i =>
          i.id === producto.id
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        )
      }
      return [...prev, {
        id:        producto.id,
        nombre:    producto.nombre,
        marca:     producto.marca ?? '',
        precio:    producto.precio,
        imagen:    producto.imagen,
        categoria: producto.categoria ?? '',
        cantidad:  1,
      }]
    })
  }

  const quitar = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) { quitar(id); return }
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, cantidad } : i)
    )
  }

  const vaciar = () => setItems([])

  const totalItems    = items.reduce((acc, i) => acc + i.cantidad, 0)
  const totalPrecio   = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const estaEnCarrito = (id) => items.some(i => i.id === id)

  return (
    <CartContext.Provider value={{
      items,
      agregar,
      quitar,
      cambiarCantidad,
      vaciar,
      totalItems,
      totalPrecio,
      estaEnCarrito,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
