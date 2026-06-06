# 📋 ARQUITECTURA COMPLETA - NEXUS REACT

## 🏗️ ESTRUCTURA DEL PROYECTO

```
nexus/
├── Configuration
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── index.html
│
├── public/                          ← Assets estáticos
│   ├── imagenes/
│   └── modelos/                     ← Modelos 3D (GLB) para builder
│       ├── cpu/, gpu/, ram/, storage/
│       ├── motherboards/, cases/
│       ├── psu/, cooling/
│
└── src/
    ├── 🔒 CONTEXTOS GLOBALES
    │   ├── AuthContext.jsx          → User + Token (login/logout)
    │   └── CartContext.jsx          → Items + Total (carrito)
    │
    ├── 📄 PÁGINAS (Rutas principales)
    │   ├── Home.jsx
    │   ├── Login.jsx                → Autenticación
    │   ├── Register.jsx             → Registro
    │   ├── Productos.jsx            → Catálogo PC + Celulares
    │   ├── ProductoDetalle.jsx      → Vista detalle
    │   ├── Carrito.jsx              → Checkout
    │   ├── ComparadorPage.jsx       → Comparador celulares
    │   ├── PcBuilder.jsx            → Constructor de PC
    │   └── admin/                   → Rutas protegidas admin
    │       ├── AdminDashboard.jsx
    │       ├── AdminProductos.jsx
    │       ├── AdminPedidos.jsx
    │       └── AdminUsuarios.jsx
    │
    ├── 🎨 COMPONENTES
    │   ├── Navbar.jsx               → Navegación + carrito
    │   ├── Footer.jsx
    │   ├── Hero.jsx, Features.jsx, FeaturedCarousel.jsx
    │   ├── ProductCard.jsx          → Card reutilizable
    │   ├── CheckoutModal.jsx        → Modal pago
    │   ├── ProtectedRoute.jsx       → Guard de rutas
    │   │
    │   ├── builder/                 → PC Builder (visualización 3D)
    │   │   ├── PcScene.jsx          → Canvas Three.js/R3F
    │   │   ├── BuilderSlots.jsx     → Selector de slots
    │   │   ├── BuilderSidebar.jsx   → Total + wattaje + progreso
    │   │   ├── BuilderModal.jsx     → Seleccionar componentes
    │   │   └── scene/               → Renderers 3D
    │   │       ├── PartRenderer.jsx
    │   │       ├── SceneCamera.jsx, SceneLights.jsx
    │   │       └── SceneErrorBoundary.jsx
    │   │
    │   └── comparador/              → Comparador celulares
    │       ├── ComparadorScreen.jsx → Pantalla principal
    │       ├── RadarChart.jsx       → Gráfico radar (axes)
    │       ├── VentajasPanel.jsx    → Diferencias
    │       ├── EspecsGrid.jsx       → Specs lado a lado
    │       └── SelectorCelular.jsx  → Modal búsqueda
    │
    ├── 🪝 HOOKS PERSONALIZADOS
    │   ├── useBuilder.js            → Lógica PC builder
    │   │   ├── setComponent(slotId, productId)
    │   │   ├── setRamSlot(slotNumber, productId)
    │   │   ├── applyPreset(slots)
    │   │   ├── getHydratedBuild()
    │   │   └── getCartItems()
    │   │
    │   └── useComparador.js         → Lógica comparador
    │       ├── seleccionarCelular(producto, slot)
    │       ├── cambiarBusqueda(query)
    │       ├── filtrarPorMarca(marca)
    │       └── comparacion → { radar, ventajas, scores }
    │
    ├── ⚙️ SERVICIOS (Lógica negocio + API)
    │   ├── authService.js
    │   │   ├── login(email, password) → { token, user }
    │   │   ├── register(nombre, email, password) → { token, user }
    │   │   └── logout()
    │   │
    │   ├── productoService.js
    │   │   ├── getByCategoria('cpu'|'gpu'|'ram'...) → [Productos]
    │   │   ├── getById(id) → Producto
    │   │   ├── getProductsMap() → { [id]: Producto }
    │   │   └── getAll() → [Productos]
    │   │
    │   ├── celularService.js
    │   │   ├── getCelulares() → [Celulares]
    │   │   └── buscarCelulares(query) → [Celulares]
    │   │
    │   ├── builderService.js
    │   │   ├── hydrateBuild(build, productsMap)
    │   │   ├── calculateTotal(build, productsMap) → Número
    │   │   ├── calculateWattage(build, productsMap) → Número
    │   │   ├── calculateProgress(build, slots) → %
    │   │   ├── canCheckout(build, slots) → Boolean
    │   │   └── buildToCartItems(hydratedBuild) → [CartItems]
    │   │
    │   ├── comparadorService.js
    │   │   ├── calcularScoresRadar(prodA, prodB) → { eje: 0-100 }
    │   │   ├── calcularVentajas(prodA, prodB) → [Diferencias]
    │   │   └── calcularScoreGlobal(prodA, prodB) → 0-100
    │   │
    │   ├── carritoService.js
    │   │   └── confirmarPedido(items, token) → { pedidoId, total }
    │   │
    │   └── adminService.js
    │       ├── getProductosAdmin() → [Productos]
    │       ├── crearProducto(datos) → Producto
    │       ├── actualizarProducto(id, datos) → Producto
    │       └── getPedidos() → [Pedidos]
    │
    ├── 💾 DOMAIN LOGIC (Sin React)
    │   ├── builderEngine.js
    │   │   ├── setComponent(build, slotId, productId)
    │   │   ├── setRamSlot(build, slotNumber, productId)
    │   │   └── applyPreset(build, slots)
    │   │
    │   └── buildModel.js
    │       └── createBuild() → Estructura vacía
    │
    ├── 🔄 ADAPTERS
    │   └── productsMap.js
    │       └── arrayToMap([productos]) → { [id]: producto }
    │
    ├── 📊 DATA (Mock + Config)
    │   ├── mockComponentesPc.js     → PC_PARTS
    │   ├── mockCelulares.js         → CELULARES
    │   ├── slotConfig.js            → Slots obligatorios/opcionales
    │   ├── compatibility.js         → Reglas de compatibilidad
    │   ├── caseConfigs.js           → Configuración gabinetes
    │   └── boardGeometry.js         → Geometría motherboards
    │
    └── 🎨 STYLES
        ├── global.css, home.css, carrito.css
        ├── Admin/
        ├── builder/
        ├── comparador/
        └── productos/
```

---

## 📡 COMUNICACIÓN DE DATOS

### **1️⃣ CONTEXTOS API (Estado Global)**

#### **AuthContext.jsx** → Autenticación
```javascript
// PROVEEDOR:
<AuthProvider>
  // Acceso global a:
  // - useAuth() → { user, token, login(), logout(), isAuthenticated }
</AuthProvider>

// CONSUMIDORES:
- Login.jsx              ← login() después de authService
- Register.jsx           ← register() después de authService
- ProtectedRoute.jsx     ← Valida isAuthenticated
- Navbar.jsx             ← Muestra user.nombre + botón logout
- AuthContext.js         ← Sincroniza localStorage

// ALMACENAMIENTO:
localStorage.setItem('nexus_token', token)
localStorage.setItem('nexus_user', JSON.stringify(user))
```

#### **CartContext.jsx** → Carrito
```javascript
// PROVEEDOR:
<CartProvider>
  // Acceso global a:
  // - useCart() → {
  //    items[], agregar(p), quitar(id), cambiarCantidad(id, qty),
  //    totalItems, totalPrecio, estaEnCarrito(id), vaciar()
  //  }
</CartProvider>

// CONSUMIDORES:
- Navbar.jsx             ← Muestra totalItems en icono
- ProductCard.jsx        ← Botón "Agregar carrito"
- PcBuilder.jsx          ← Agregar build completo
- ComparadorScreen.jsx   ← Agregar celulares
- Carrito.jsx            ← Listar, cambiar cantidad, pagar
- BuilderSidebar.jsx     ← Botón final "Agregar al carrito"

// ALMACENAMIENTO:
localStorage.setItem('nexus_cart', JSON.stringify(items))
// Se sincroniza en tiempo real con useEffect
```

---

### **2️⃣ SERVICIOS (Capa Negocio + API)**

```
┌─────────────────────────────────────────┐
│         ARQUITECTURA EN CAPAS            │
└─────────────────────────────────────────┘

PRESENTACIÓN (Components)
    ↓ llama a
HOOKS PERSONALIZADOS (useBuilder, useComparador)
    ↓ usan
SERVICIOS (authService, productoService, builderService, etc.)
    ↓ consultan / modifican
DATA LAYER (localStorage, mock datos)
    ↓
DOMAIN LOGIC (builderEngine, comparadorLogic)
```

#### **authService.js**
```javascript
INPUT:
  - login(email, password)
  - register(nombre, email, password)

PROCESO:
  Valida credenciales en localStorage → nexus_users
  Si coincide → genera { token, user }

OUTPUT:
  { token, user: { id, nombre, email, rol } }

CONSUMIDORES:
  Login.jsx → authService.login() → AuthContext.login()
  Register.jsx → authService.register() → AuthContext.login()
```

#### **productoService.js**
```javascript
INPUT:
  - getByCategoria(categoria) → "cpu", "gpu", "ram", etc.
  - getById(id)
  - getProductsMap()
  - getAll()

PROCESO:
  Carga mockComponentesPc.js
  Filtra por categoría usando producto.categoria

OUTPUT:
  [{ id, nombre, marca, precio, imagen, categoria, specs }]

CONSUMIDORES:
  Productos.jsx → getAll() + getCelulares()
  ProductoDetalle.jsx → getById(id)
  useBuilder.js → getProductsMap() → { [id]: producto }
```

#### **celularService.js**
```javascript
INPUT:
  - getCelulares()
  - buscarCelulares(query)

PROCESO:
  Carga mockCelulares.js
  Filtra por marca o búsqueda de texto

OUTPUT:
  [{ id, marca, modelo, precio, imagen, specs: {...} }]

CONSUMIDORES:
  Productos.jsx → getCelulares()
  useComparador.js → getCelulares() + buscarCelulares()
  ComparadorScreen.jsx (indirecta vía useComparador)
```

#### **builderService.js** (PURO - Sin API)
```javascript
INPUT:
  - hydrateBuild(build, productsMap)
    build = { cpu, gpu, motherboard, ram: [id, id], storage: [id], ... }
  - calculateTotal(build, productsMap) → suma precios
  - calculateWattage(build, productsMap) → suma TDP + PDatos
  - calculateProgress(build, requiredSlots) → % completitud
  - canCheckout(build, slots) → ¿100% obligatorios?
  - buildToCartItems(hydratedBuild) → conversión a CartItems

PROCESO:
  1. hydrateBuild: Reemplaza IDs por objetos completos
  2. calculateTotal: Suma producto.precio para cada componente
  3. calculateWattage: CPU.tdp + GPU.potencia + 75W base
  4. calculateProgress: (slots rellenos / slots obligatorios) × 100
  5. canCheckout: Valida que todos los slots obligatorios ≠ null
  6. buildToCartItems: Mapea build → [{id, nombre, precio, cantidad}]

OUTPUT:
  - hydrateBuild → { cpu: {...}, gpu: {...}, ... }
  - calculateTotal → 3500 (número)
  - calculateWattage → 450 (número)
  - calculateProgress → 75 (%)
  - canCheckout → true | false
  - buildToCartItems → [{ id, nombre, precio, cantidad: 1 }]

CONSUMIDORES:
  useBuilder.js → Todos los anteriores
  BuilderSidebar.jsx ← Recibe total, wattaje, progreso
```

#### **comparadorService.js** (PURO - Sin API)
```javascript
INPUT:
  - calcularScoresRadar(celularA, celularB)
  - calcularVentajas(celularA, celularB)
  - calcularScoreGlobal(celularA, celularB)

PROCESO:
  1. Radar: Normaliza cada spec en escala 0-100 por eje
     Ejes: Rendimiento, Resolución, Pantalla, Cámara Principal, 
           Cámara Frontal, Batería, RAM, Almacenamiento
  2. Ventajas: Compara cada eje, retorna ganador + diferencia
  3. ScoreGlobal: Promedio ponderado de todos los ejes

OUTPUT:
  - Radar → { rendimiento: 85, resolucion: 70, ... }
  - Ventajas → [{ eje, ganador, diferencia }]
  - ScoreGlobal → 78

CONSUMIDORES:
  useComparador.js → Todos los anteriores
  RadarChart.jsx ← scoresRadar para gráfico
  VentajasPanel.jsx ← ventajas para diferencias
```

#### **carritoService.js**
```javascript
INPUT:
  - confirmarPedido(items, token)
  items = [{ id, nombre, precio, cantidad }, ...]
  token = JWT

PROCESO:
  Valida token en localStorage (nexus_users)
  Crea pedido: { id, items, total, usuarioId, estado: 'CONFIRMADO', fecha }
  Almacena en localStorage (nexus_pedidos)

OUTPUT:
  { pedidoId: "PED-123", total: 3500, estado: 'CONFIRMADO' }

CONSUMIDORES:
  Carrito.jsx → handleConfirmar()
  AuthContext → Valida que el usuario esté logueado
```

#### **adminService.js**
```javascript
INPUT:
  - getProductosAdmin()
  - crearProducto(datos)
  - actualizarProducto(id, datos)
  - borrarProducto(id)
  - getPedidos()
  - actualizarPedido(id, estado)

PROCESO:
  Leer/escribir en localStorage
  nexus_productos (mock)
  nexus_pedidos (mock)

OUTPUT:
  Array de productos / pedidos

CONSUMIDORES:
  AdminProductos.jsx → CRUD productos
  AdminPedidos.jsx → Ver y cambiar estado
  AdminUsuarios.jsx → getUsuarios()
```

---

### **3️⃣ FLUJOS DE DATOS PRINCIPAL**

#### **🔐 FLUJO: Autenticación**
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario ingresa email + password en Login.jsx
│    │
│    ├─ onChange → loginForm.email / password (useState)
│    │
│    └─ onSubmit → authService.login(email, password)
│         │
│         ├─→ authService busca en localStorage.nexus_users
│         │    Si encuentra → { token, user }
│         │    Si no → Error: "Credenciales inválidas"
│         │
│         └─→ AuthContext.login({ token, user })
│              │
│              ├─ localStorage.setItem('nexus_token', token)
│              ├─ localStorage.setItem('nexus_user', JSON.stringify(user))
│              ├─ setToken(token)
│              ├─ setUser(user)
│              │
│              └─→ HOOKS EN TODO EL APP ACTUALIZADOS
│                   │
│                   ├─ useAuth().isAuthenticated = true
│                   ├─ useAuth().user.nombre = "Juan"
│                   │
│                   └─→ ProtectedRoute ✓ permite acceso
│                       Navbar ✓ muestra nombre
│                       Carrito ✓ habilita checkout
│
└─────────────────────────────────────────────────────────────┘
```

#### **🛒 FLUJO: Agregar al Carrito**
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario hace click en "Agregar al carrito" (ProductCard)
│    │
│    └─ onClick → handleAgregar(producto)
│         │
│         └─ useCart().agregar(producto)
│              │
│              ├─ cartContext busca si producto.id existe en items
│              │
│              ├─ Si SÍ existe
│              │  └─ items[index].cantidad++
│              │
│              └─ Si NO existe
│                 └─ items.push({ id, nombre, precio, imagen, cantidad: 1 })
│                      │
│                      ├─ setItems([...items])
│                      │
│                      └─ useEffect
│                         └─ localStorage.setItem('nexus_cart', JSON.stringify(items))
│                            │
│                            └─→ Navbar renderiza totalItems
│                                (items.reduce((sum, item) => sum + item.cantidad, 0))
│
└─────────────────────────────────────────────────────────────┘
```

#### **💰 FLUJO: Checkout**
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario en Carrito.jsx → Click "Confirmar compra"
│    │
│    └─ handleConfirmar()
│         │
│         ├─ SI NO autenticado
│         │  └─ useAuth().isAuthenticated === false
│         │     └─ setEstado('login-gate')
│         │        └─ Renderiza CheckoutModal con form login
│         │           └─ Usuario loguea aquí mismo
│         │
│         └─ SI autenticado
│            │
│            └─ carritoService.confirmarPedido(items, token)
│                 │
│                 ├─ Valida token en localStorage.nexus_users
│                 ├─ Calcula total = items.reduce((sum, item) =>
│                 │                   sum + (item.precio * item.cantidad), 0)
│                 ├─ Crea pedido:
│                 │  { pedidoId, items, total, usuarioId, 
│                 │    estado: 'CONFIRMADO', fecha: new Date() }
│                 ├─ Almacena en localStorage.nexus_pedidos
│                 │
│                 └─→ Retorna { pedidoId, total, estado }
│                      │
│                      ├─ useCart().vaciar()
│                      │  └─ items = []
│                      │  └─ localStorage.removeItem('nexus_cart')
│                      │
│                      └─→ Mostrar "Pedido #PED-123 confirmado!"
│
└─────────────────────────────────────────────────────────────┘
```

#### **🖥️ FLUJO: PC Builder**
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario en PcBuilder.jsx
│    │
│    └─ const builder = useBuilder()
│         │
│         ├─ useState(createBuild()) → Build vacío
│         │  Build = {
│         │    cpu: null, gpu: null, motherboard: null,
│         │    ram: [null, null, null, null],
│         │    storage: [null, null],
│         │    psu: null, case: null, cooling: null
│         │  }
│         │
│         └─ BuilderSlots.jsx renderiza dropdowns
│              │
│              └─ Usuario selecciona componente
│                 └─ onClick → openModal('cpu') / openModal('gpu')
│                    │
│                    └─→ BuilderModal muestra productos por categoría
│                        │
│                        └─ Usuario click en producto
│                           └─ setComponent('cpu', productId)
│                              │
│                              ├─ builderEngine.setComponent(build, 'cpu', productId)
│                              │  build.cpu = productId (solo ID)
│                              │
│                              └─ setState(build)
│                                 │
│                                 └─→ useMemo ([build])
│                                     │
│                                     ├─ hydrateBuild(build, PRODUCTS_MAP)
│                                     │  build.cpu = { id, nombre, precio, tdp, ... }
│                                     │
│                                     ├─ calculateTotal(hydratedBuild, PRODUCTS_MAP)
│                                     │  total = 3500
│                                     │
│                                     ├─ calculateWattage(hydratedBuild, PRODUCTS_MAP)
│                                     │  wattage = 450
│                                     │
│                                     ├─ calculateProgress(build, SLOTS_OBLIGATORIOS)
│                                     │  progreso = 75%
│                                     │
│                                     └─ canCheckout(build, SLOTS_OBLIGATORIOS)
│                                        canAdd = progreso === 100%
│                                        │
│                                        └─→ BuilderSidebar.jsx
│                                            │
│                                            ├─ Muestra: "$3500"
│                                            ├─ Muestra: "450W / 650W" (con indicador)
│                                            ├─ Muestra: "Progress bar 75%"
│                                            └─ Botón "Agregar al carrito" (disabled si < 100%)
│                                                │
│                                                └─ Click → handleAddToCart()
│                                                   │
│                                                   ├─ buildToCartItems(hydratedBuild)
│                                                   │  → [{ id, nombre, precio, cantidad: 1 }, ...]
│                                                   │
│                                                   └─ useCart().agregar(item) × N componentes
│                                                      │
│                                                      └─→ CartContext suma todos a items
│                                                          │
│                                                          └─→ Navbar actualiza totalItems
│
└─────────────────────────────────────────────────────────────┘
```

#### **⚔️ FLUJO: Comparador**
```
┌─────────────────────────────────────────────────────────────┐
│ 1. Usuario en ComparadorPage.jsx
│    │
│    └─ const comp = useComparador()
│         │
│         ├─ useState({ celularA, celularB, modalSlot, busqueda })
│         │
│         ├─ useEffect
│         │  └─ celularService.getCelulares() → CELULARES
│         │
│         └─ Usuarios ven botones "Seleccionar" (A y B)
│              │
│              └─ onClick → abrirModal('a')
│                 │
│                 └─→ SelectorCelular (modal)
│                     │
│                     ├─ Usuario busca: input → setBusqueda(query)
│                     │  useMemo → productosFiltrados
│                     │
│                     └─ Usuario click en celular
│                        └─ seleccionar(celular)
│                           │
│                           └─ setSelA(celular) o setSelB(celular)
│                              │
│                              ├─ setItems([celularA, celularB])
│                              │  (actualiza CartContext si agregan)
│                              │
│                              └─→ useEffect cierra modal
│                                 │
│                                 └─→ useMemo ([celularA, celularB])
│                                     │
│                                     ├─ calcularScoresRadar(A, B)
│                                     │  { rendimiento: 85, resolucion: 70, ... }
│                                     │
│                                     ├─ calcularVentajas(A, B)
│                                     │  [{ eje: "Pantalla", ganador: "A", dif: 2" }]
│                                     │
│                                     ├─ calcularScoreGlobal(A, B)
│                                     │  scoreAsobreB = 78
│                                     │
│                                     └─ calcularScoreGlobal(B, A)
│                                        scoreBobreA = 22
│                                        │
│                                        └─→ Componentes renderizan
│                                            RadarChart → gráfico de araña
│                                            VentajasPanel → diferencias
│                                            EspecsGrid → specs lado a lado
│                                            │
│                                            └─ Botones "Agregar al carrito"
│                                               └─ useCart().agregar()
│
└─────────────────────────────────────────────────────────────┘
```

---

### **4️⃣ MATRIZ DE DEPENDENCIAS**

| Componente | Lee de | Escribe en | API | Almacenamiento |
|------------|--------|-----------|-----|---|
| Login.jsx | authService | AuthContext | localStorage | ✅ |
| ProductCard.jsx | productoService | CartContext | localStorage | ✅ |
| PcBuilder.jsx | builderService, productoService | useBuilder | localStorage | ❌ |
| BuilderSidebar.jsx | builderService | CartContext (add) | - | ✅ |
| ComparadorScreen.jsx | comparadorService, celularService | CartContext | localStorage | ✅ |
| Carrito.jsx | CartContext, AuthContext | carritoService | localStorage | ✅ |
| AdminProductos.jsx | adminService | adminService | localStorage | ✅ |
| Productos.jsx | productoService, celularService | CartContext | localStorage | ✅ |

---

### **5️⃣ PATRONES DE COMUNICACIÓN**

#### **Patrón 1: Context API (Estado Global)**
```javascript
// Uso en componentes:
const { items, agregar } = useCart();
const { user, isAuthenticated } = useAuth();

// Actualización:
agregar(producto); // Automáticamente actualiza todos los consumidores
```

#### **Patrón 2: Custom Hooks (Lógica centralizada)**
```javascript
// useBuilder.js encapsula lógica de builder
const { setComponent, getHydratedBuild, getCartItems } = useBuilder();

// useComparador.js encapsula lógica de comparación
const { calcularScoresRadar, ventajas, scoresA, scoresB } = useComparador();
```

#### **Patrón 3: Servicios (Capa negocio)**
```javascript
// No tienen estado
// Retornan Promise o datos puros
const productos = await productoService.getByCategoria('cpu');
const total = builderService.calculateTotal(build, map);
```

#### **Patrón 4: Props (Componentes padres → hijos)**
```javascript
<ProductCard 
  producto={producto}
  onAgregarCarrito={handleAgregar}
  onVerDetalle={handleDetalle}
/>
```

#### **Patrón 5: LocalStorage (Persistencia)**
```javascript
// AuthContext persiste:
- nexus_token
- nexus_user

// CartContext persiste:
- nexus_cart

// Admin persiste:
- nexus_usuarios
- nexus_productos
- nexus_pedidos
```

---

## 📊 RESUMEN

### **Flujo de datos general:**
```
USUARIO INTERACTÚA
    ↓
COMPONENTE (e.g., ProductCard.jsx)
    ↓
HOOK PERSONALIZADO o SERVICIO
    ↓
CONTEXT API (Estado global)
    ↓
LOCALSTORAGE (Persistencia)
    ↓
OTROS COMPONENTES se actualizan automáticamente (re-render)
```

### **Capas:**
1. **Presentación**: Componentes React
2. **Lógica Negocio**: Servicios + Custom Hooks
3. **Estado**: Context API + localStorage
4. **Persistencia**: localStorage (sin backend real)

### **Seguridad:**
- ProtectedRoute valida `isAuthenticated`
- AdminLayout valida `user.rol === 'ROLE_ADMIN'`
- carritoService valida token antes de confirmar

---

## 🔧 Tecnologías

- **Frontend**: React 18 + Vite
- **Enrutamiento**: React Router (implícito en App.jsx)
- **3D**: Three.js / R3F (PcBuilder)
- **Gráficos**: Custom RadarChart (comparador)
- **Estado**: Context API + localStorage
- **Estilos**: CSS vanilla

---

*Documento generado automáticamente - Última actualización: 2026-05-31*
