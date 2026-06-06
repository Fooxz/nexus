# 📦 ESTRUCTURA COMPLETA DEL PROYECTO NEXUS

## 📂 ÁRBOL DE ARCHIVOS Y CARPETAS

```
nexus/
├── 🔧 CONFIGURACIÓN Y RAÍZ
│   ├── index.html                      # HTML principal (Vite entra aquí)
│   ├── package.json                    # Dependencias y scripts
│   ├── package-lock.json               # Lock file npm
│   ├── vite.config.js                  # Configuración Vite + React plugin
│   ├── eslint.config.js                # ESLint
│   └── README.md
│
├── public/                             # Assets estáticos (no procesados)
│   ├── imagenes/                       # Logos, fotos, banderas
│   └── modelos/                        # Modelos 3D (GLB) para el builder
│       ├── cpu/                        # Modelos de CPUs
│       ├── gpu/                        # Modelos de GPUs
│       ├── ram/                        # Módulos RAM
│       ├── motherboards/               # Placas madre
│       ├── psu/                        # Fuentes de poder
│       ├── cooling/                    # Sistemas de refrigeración
│       ├── cases/                      # Gabinetes
│       └── storage/                    # Discos duros / SSDs
│
└── src/                                # FUENTE PRINCIPAL
    ├── 📄 ENTRY POINT
    │   ├── main.jsx                    # React root + AuthProvider + CartProvider
    │   ├── App.jsx                     # Router principal (BrowserRouter + Routes)
    │   ├── App.css                     # Estilos globales de App
    │   └── index.css                   # Reset y variables CSS
    │
    ├── 🔐 CONTEXTOS GLOBALES
    │   └── context/
    │       ├── AuthContext.jsx         # useAuth() — usuario, token, login/logout
    │       └── CartContext.jsx         # useCart() — items, agregar, quitar, vaciar
    │
    ├── ⚙️ CONFIGURACIÓN DE API
    │   └── config/
    │       └── api.js                 # BaseURL y endpoints de la API
    │
    ├── 📄 PÁGINAS (Componentes de Ruta)
    │   └── pages/
    │       ├── Home.jsx                # Landing page con Hero + Features
    │       ├── Login.jsx               # Form login (POST a authService)
    │       ├── Register.jsx            # Form registro
    │       ├── Productos.jsx           # Catálogo unificado (PC + Celulares)
    │       ├── ProductoDetalle.jsx     # Detalle de producto individual
    │       ├── Carrito.jsx             # Carrito + Checkout
    │       ├── ComparadorPage.jsx      # Wrapper del comparador
    │       ├── PcBuilder.jsx           # Constructor de PC (canvas 3D)
    │       └── admin/                  # RUTAS PROTEGIDAS (ROLE_ADMIN)
    │           ├── AdminDashboard.jsx  # Stats, resumen
    │           ├── AdminProductos.jsx  # CRUD productos
    │           ├── AdminPedidos.jsx    # Ver y gestionar pedidos
    │           └── AdminUsuarios.jsx   # Gestionar usuarios
    │
    ├── 🎨 COMPONENTES REUTILIZABLES
    │   └── components/
    │       ├── Navbar.jsx              # Header + menu + carrito icon
    │       ├── Footer.jsx              # Footer global
    │       ├── Hero.jsx                # Sección hero (home)
    │       ├── Features.jsx            # Sección features (home)
    │       ├── FeaturedCarousel.jsx    # Carrusel de destacados
    │       ├── ProductCard.jsx         # Card producto (reutilizable)
    │       ├── CheckoutModal.jsx       # Modal de pago/login
    │       ├── ProtectedRoute.jsx      # Guard: valida isAuthenticated
    │       │
    │       ├── admin/                  # Admin layout
    │       │   └── AdminLayout.jsx     # Layout sidebar + contenido
    │       │
    │       ├── builder/                # 🔨 CONSTRUCTOR PC (3D + UI)
    │       │   ├── BuilderSlots.jsx    # Selectores de componentes
    │       │   ├── BuilderSidebar.jsx  # Panel resumen (total, watts)
    │       │   ├── BuilderModal.jsx    # Modal selección de partes
    │       │   ├── PartModels.jsx      # Mapeo partes a modelos 3D
    │       │   ├── PcScene.jsx         # Canvas Three.js/R3F
    │       │   └── scene/              # Renderización 3D
    │       │       ├── PartRenderer.jsx     # Render individual de partes
    │       │       ├── SceneCamera.jsx      # Configuración cámara
    │       │       ├── SceneLights.jsx      # Luces de la escena
    │       │       ├── SceneStrip.jsx       # Tira/carrusel de partes
    │       │       └── SceneErrorBoundary.jsx # Error boundary para 3D
    │       │
    │       └── comparador/             # ⚔️ COMPARADOR CELULARES
    │           ├── ComparadorScreen.jsx    # Pantalla principal
    │           ├── Comparador-componente.jsx # (deprecated?)
    │           ├── SelectorCelular.jsx      # Modal búsqueda celulares
    │           ├── RadarChart.jsx          # Gráfico radar/araña
    │           ├── VentajasPanel.jsx       # Panel ventajas/desventajas
    │           └── EspecsGrid.jsx          # Grid 2-columnas specs
    │
    ├── 🪝 HOOKS PERSONALIZADOS
    │   └── hooks/
    │       ├── useBuilder.js           # Lógica del PC builder
    │       │   ├── useState(build)
    │       │   ├── setComponent(slotId, productId)
    │       │   ├── setRamSlot(slotNumber, productId)
    │       │   ├── setStorageSlot(slotKey, productId)
    │       │   ├── removePart(slotId, slotNumber)
    │       │   ├── applyPreset(slots)
    │       │   ├── openModal(), closeModal()
    │       │   ├── selectPart(part)
    │       │   ├── getHydratedBuild() → Build con objetos completos
    │       │   ├── getCartItems() → [CartItems] para agregar al carrito
    │       │   └── Retorna: { build, hydratedBuild, total, wattage, progress, ... }
    │       │
    │       └── useComparador.js        # Lógica del comparador
    │           ├── useState(selA, selB, modalSlot, busqueda)
    │           ├── seleccionar(celular, slot)
    │           ├── cambiarBusqueda(query)
    │           ├── filtrarPorMarca(marca)
    │           └── useMemo → comparacion { radar, ventajas, scores }
    │
    ├── ⚙️ SERVICIOS (Capa negocio + API calls)
    │   └── services/
    │       ├── authService.js
    │       │   ├── register({ nombre, email, password }) → { token, user }
    │       │   ├── login(email, password) → { token, user }
    │       │   ├── logout() → void
    │       │   ├── getToken() → string | null
    │       │   └── getUser() → object | null
    │       │   [USE_MOCK = true → localStorage]
    │       │
    │       ├── productoService.js
    │       │   ├── getByCategoria(cat) → [Productos] (PC_PARTS[cat])
    │       │   ├── getById(id) → Producto
    │       │   ├── getProductsMap() → { [id]: Producto }
    │       │   └── getAll() → [Productos] array plano
    │       │   [USE_MOCK = true → mockComponentesPc.js]
    │       │
    │       ├── celularService.js
    │       │   ├── getCelulares() → [Celulares]
    │       │   └── buscarCelulares(query) → [Celulares] filtrados
    │       │   [USE_MOCK = false → Spring Boot]
    │       │
    │       ├── builderService.js (PURO — sin React)
    │       │   ├── hydrateBuild(build, map) → Build con objetos
    │       │   ├── calculateTotal(build, map) → número precio
    │       │   ├── calculateWattage(build, map) → número watts
    │       │   ├── calculateProgress(build, slots) → % 0-100
    │       │   ├── canCheckout(build, slots) → boolean
    │       │   └── buildToCartItems(hydratedBuild) → [CartItems]
    │       │
    │       ├── comparadorService.js (PURO — sin React)
    │       │   ├── calcularScoresRadar(A, B) → { eje: 0-100 }
    │       │   ├── calcularVentajas(A, B) → [{ eje, ganador, dif }]
    │       │   ├── calcularScoreGlobal(A, B) → 0-100
    │       │   └── [Tabla PROCESSOR_SCORES para mapear CPU a puntos]
    │       │
    │       ├── carritoService.js
    │       │   └── confirmarPedido(items, token) → { pedidoId, total }
    │       │   [USE_MOCK = true → simulado]
    │       │
    │       └── adminService.js
    │           ├── getProductosAdmin() → [Productos]
    │           ├── crearProducto(datos) → Producto
    │           ├── actualizarProducto(id, datos) → Producto
    │           ├── borrarProducto(id) → void
    │           ├── getPedidos() → [Pedidos]
    │           ├── actualizarPedido(id, estado) → Pedido
    │           ├── getUsuarios() → [Usuarios]
    │           └── [USE_MOCK = true → localStorage]
    │
    ├── 💾 DOMAIN LOGIC (Lógica pura, sin React ni side-effects)
    │   └── domain/
    │       ├── buildModel.js           # Contrato de estructura del build
    │       │   ├── BUILD_VERSION = 1
    │       │   ├── SINGLE_SLOTS = ['cpu', 'motherboard', 'gpu', 'psu', 'cooling', 'case']
    │       │   ├── MULTI_SLOTS = ['ramSlots', 'storageSlots']
    │       │   ├── SLOT_DEPENDENCIES = { motherboard: ['cpu', 'ramSlots'] }
    │       │   ├── MULTI_SLOT_KEYS = { ram: 'ramSlots', storage: 'storageSlots' }
    │       │   └── createEmptyBuild(caseId) → Estructura vacía
    │       │
    │       └── builderEngine.js        # Manipulación del build (funciones puras)
    │           ├── createBuild(caseId) → Build
    │           ├── setComponent(build, slotId, productId) → Build
    │           ├── removeComponent(build, slotId) → Build
    │           ├── setRamSlot(build, slotNum, productId) → Build
    │           ├── setStorageSlot(build, slotKey, productId) → Build
    │           ├── applyPreset(build, slots) → Build
    │           ├── selectCase(build, caseProduct) → Build
    │           ├── validateStructure(build) → boolean
    │           └── clearBuild(build) → Build vacío
    │
    ├── 🔄 ADAPTERS (Transformación de datos externos)
    │   └── adapters/
    │       └── productsMap.js
    │           ├── createProductsMap(array) → { [id]: producto }
    │           ├── flattenPcParts(pcParts) → array plano
    │           └── getProduct(map, id) → producto | null
    │
    ├── 📊 DATA (Mocks + Configuración)
    │   └── data/
    │       ├── mockComponentesPc.js    # PC_PARTS: { cpu: [...], gpu: [...], ... }
    │       │   • Estructura: { id, nombre, marca, precio, categoria, specs }
    │       │   • Categorías: cpu, gpu, ram, motherboard, storage, psu, case, cooling
    │       │   • Specs por categoría: nucleos, hilos, velocidad, tdp, vram, potencia, etc.
    │       │
    │       ├── mockCelulares.js        # CELULARES: [{ id, marca, modelo, precio, specs }]
    │       │   • Estructura: { id, marca, modelo, precio, imagen, specs: {...} }
    │       │   • Specs: pantalla, procesador, ram, almacenamiento, bateria, camaras
    │       │
    │       ├── slotConfig.js           # Configuración de slots y presets
    │       │   • SLOT_CONFIG: [ { id, label, required, multi }, ... ]
    │       │   • PRESETS: [ { id, name, slots: {...} }, ... ]
    │       │   • PRESETS_META: [{ id, name, price, ... }, ...]
    │       │
    │       ├── compatibility.js        # Reglas de compatibilidad
    │       │   • checkCompatibility(components) → { warnings, errors }
    │       │   • Valida socket CPU ↔ motherboard, capacidad PSU, etc.
    │       │
    │       ├── caseConfigs.js          # Configuración de gabinetes
    │       │   • Dimensiones, soportes, restricciones
    │       │
    │       └── boardGeometry.js        # Geometría de motherboards
    │           • Posiciones de slots, forma, tamaño
    │
    └── 🎨 ESTILOS (CSS por componente/página)
        └── styles/
            ├── global.css              # Variables CSS, reset, tipografía
            ├── index.css               # Estilos iniciales
            ├── App.css                 # Estilos de App
            ├── home.css                # Home page
            ├── carrito.css             # Carrito page
            ├── CheckoutModal.css       # Modal checkout
            │
            ├── Admin/                  # Estilos admin
            │   ├── admin.css           # Layout general
            │   ├── adminDashboard.css  # Dashboard
            │   ├── adminLayout.css     # Sidebar + contenido
            │   └── adminProductos.css  # Tabla productos
            │
            ├── builder/                # Estilos builder 3D
            │   ├── builder-core.css    # Layout general
            │   ├── builder-slots.css   # Selectores
            │   ├── builder-modal.css   # Modal selección
            │   ├── builder-summary.css # Resumen/sidebar
            │   ├── builder-toasts.css  # Notificaciones
            │   └── builder-visualizer.css # Canvas 3D
            │
            ├── comparador/             # Estilos comparador
            │   └── comparador.css      # Pantalla comparador
            │
            └── productos/              # Estilos catálogo
                ├── productCard.css     # Card producto
                ├── productDetail.css   # Detalle producto
                ├── productFeatured.css # Carrusel destacados
                └── productLayout.css   # Layout catálogo
```

---

## 📋 DESCRIPCIÓN DETALLADA POR SECCIÓN

### 1️⃣ ENTRY POINT (main.jsx)
```javascript
// src/main.jsx
createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
)
```
**Responsabilidad**: 
- Montar React en el DOM
- Envolver todo con AuthProvider (sesión global)
- Envolver todo con CartProvider (carrito global)

---

### 2️⃣ ROUTER (App.jsx)
```javascript
// src/App.jsx
<BrowserRouter>
  <Routes>
    {/* Públicas */}
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/comparador" element={<ComparadorPage />} />
    <Route path="/productos" element={<Productos />} />
    <Route path="/productos/:id" element={<ProductoDetalle />} />
    <Route path="/carrito" element={<Carrito />} />
    
    {/* Protegida usuario */}
    <Route path="/pc-builder" element={<ProtectedRoute><PcBuilder /></ProtectedRoute>} />
    
    {/* Protegidas admin */}
    <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/productos" element={<ProtectedRoute adminOnly><AdminProductos /></ProtectedRoute>} />
    <Route path="/admin/pedidos" element={<ProtectedRoute adminOnly><AdminPedidos /></ProtectedRoute>} />
    <Route path="/admin/usuarios" element={<ProtectedRoute adminOnly><AdminUsuarios /></ProtectedRoute>} />
  </Routes>
</BrowserRouter>
```

**Rutas**:
- `/` → Home (landing)
- `/login` → Login page
- `/register` → Registro
- `/comparador` → Comparador celulares
- `/productos` → Catálogo PC + Celulares
- `/productos/:id` → Detalle producto
- `/carrito` → Checkout
- `/pc-builder` → Constructor (PROTEGIDA)
- `/admin/*` → Admin (PROTEGIDA + ROLE_ADMIN)

---

### 3️⃣ CONTEXTOS GLOBALES

#### AuthContext.jsx
```javascript
const { user, token, login, logout, isAuthenticated } = useAuth()

// user = { id, nombre, email, rol: 'ROLE_USER' | 'ROLE_ADMIN' }
// token = JWT string | null
// login({ token, user }) → actualiza estado + localStorage
// logout() → limpia estado + localStorage
// isAuthenticated = !!token
```

**Persistencia**:
```javascript
localStorage.setItem('nexus_token', token)
localStorage.setItem('nexus_user', JSON.stringify(user))
```

#### CartContext.jsx
```javascript
const { items, agregar, quitar, cambiarCantidad, vaciar, totalItems, totalPrecio, estaEnCarrito } = useCart()

// items = [{ id, nombre, marca, precio, imagen, categoria, cantidad }, ...]
// agregar(producto) → aumenta cantidad o agrega nuevo
// quitar(id) → elimina del carrito
// cambiarCantidad(id, cantidad) → actualiza cantidad
// vaciar() → limpia items
// totalItems = suma de cantidades
// totalPrecio = suma de (precio × cantidad)
// estaEnCarrito(id) → boolean
```

**Persistencia**:
```javascript
localStorage.setItem('nexus_cart', JSON.stringify(items))
// Se sincroniza automáticamente con useEffect
```

---

### 4️⃣ SERVICIOS (Capa negocio)

#### authService.js
```javascript
login(email, password)              → { token, user }
register({ nombre, email, password })   → { token, user }
logout()                            → void
getToken()                          → JWT | null
getUser()                           → user | null

// USE_MOCK = true: localStorage (nexus_users)
// Admin default: admin@nexus.com / admin123
```

#### productoService.js
```javascript
getByCategoria(categoria)           → [Productos]  // 'cpu', 'gpu', 'ram', etc.
getById(id)                         → Producto | null
getProductsMap()                    → { [id]: Producto }
getAll()                            → [Productos] plano

// USE_MOCK = true: mockComponentesPc.js
```

**Estructura Producto**:
```javascript
{
  id, nombre, marca, precio, precioNormal, descuento, imagen, categoria,
  // Specs por tipo:
  nucleos, hilos, velocidad, tdp,      // CPU
  vram, potencia,                       // GPU
  capacidad, tipo, velocidadLec,       // Storage
  socket, chipset, slotsRam, formatoRam, // Motherboard
  certificacion, modular,               // PSU
  formato, ventanas, tdpSoporte,       // Case
}
```

#### celularService.js
```javascript
getCelulares()                      → [Celulares]
buscarCelulares(query)              → [Celulares] filtrados

// USE_MOCK = false → Spring Boot
```

**Estructura Celular**:
```javascript
{
  id, marca, modelo, precio, precioNormal, descuento, imagen,
  specs: {
    pantalla, procesador, ram, almacenamiento, bateria,
    camaraPrincipal, camaraFrontal, resolucion
  }
}
```

#### builderService.js (PURO)
```javascript
hydrateBuild(build, productsMap)        → Build con objetos completos
calculateTotal(build, productsMap)      → número
calculateWattage(build, productsMap)    → número
calculateProgress(build, requiredSlots) → 0-100 %
canCheckout(build, requiredSlots)       → boolean
buildToCartItems(hydratedBuild)         → [CartItems]
exportBuild(build)                      → { version, caseId, components, ... }
```

#### comparadorService.js (PURO)
```javascript
calcularScoresRadar(celularA, celularB) → { rendimiento: 85, resolucion: 70, ... }
calcularVentajas(celularA, celularB)    → [{ eje, ganador, diferencia }]
calcularScoreGlobal(celularA, celularB) → 0-100

// Ejes:
// - Rendimiento (tabla PROCESSOR_SCORES)
// - Resolución, Pantalla, Cámaras, Batería, RAM, Storage
```

#### carritoService.js
```javascript
confirmarPedido(items, token)           → { pedidoId, total, estado }

// USE_MOCK = true: simulado con setTimeout
// Valida token antes de confirmar
```

#### adminService.js
```javascript
getProductosAdmin()                     → [Productos]
crearProducto(datos)                    → Producto
actualizarProducto(id, datos)           → Producto
borrarProducto(id)                      → void
getPedidos()                            → [Pedidos]
actualizarPedido(id, estado)            → Pedido
getUsuarios()                           → [Usuarios]

// USE_MOCK = true: localStorage (nexus_usuarios, nexus_productos, nexus_pedidos)
```

---

### 5️⃣ HOOKS PERSONALIZADOS

#### useBuilder.js
```javascript
const builder = useBuilder()

// Estado:
builder.build                       // Estructura del build
builder.hydratedBuild               // Build con objetos completos
builder.total                       // Precio total
builder.wattage                     // Consumo watts
builder.progress                    // % completitud
builder.canAddToCart                // ¿100% obligatorios?
builder.compatibility               // { warnings, errors }

// Métodos:
builder.openModal(slotId, slotNumber)
builder.closeModal()
builder.selectPart(part)
builder.removePart(slotId, slotNumber)
builder.applyPreset(slots)
builder.clearBuild()
builder.getHydratedBuild()          → Build con objetos
builder.getCartItems()              → [CartItems]
```

#### useComparador.js
```javascript
const comp = useComparador()

// Estado:
comp.celularA, comp.celularB        // Seleccionados
comp.busqueda                       // Query de búsqueda
comp.filtroMarca                    // Marca activa
comp.modalSlot                      // 'a' | 'b'
comp.productosFiltrados             // [Celulares] filtrados

// Métodos:
comp.seleccionar(celular, slot)
comp.cambiarBusqueda(query)
comp.abrirModal(slot)
comp.cerrarModal()

// Cálculos:
comp.scoresRadar                    // Gráfico radar
comp.ventajas                       // Diferencias entre A y B
comp.scoreAsobreB, comp.scoreBobreA // Scores globales
```

---

### 6️⃣ DOMAIN LOGIC (Funciones puras)

#### buildModel.js
```javascript
BUILD_VERSION = 1
SINGLE_SLOTS = ['cpu', 'motherboard', 'gpu', 'psu', 'cooling', 'case']
MULTI_SLOTS = ['ramSlots', 'storageSlots']
SLOT_DEPENDENCIES = { motherboard: ['cpu', 'ramSlots'] }
MULTI_SLOT_KEYS = { ram: 'ramSlots', storage: 'storageSlots' }

createEmptyBuild(caseId) → {
  version: 1,
  caseId: 'mid-tower',
  components: {
    cpu: null,
    motherboard: null,
    gpu: null,
    psu: null,
    cooling: null,
    case: null,
    ramSlots: [],
    storageSlots: []
  }
}
```

#### builderEngine.js
```javascript
createBuild(caseId)                     → Build
setComponent(build, slotId, productId)  → Build (con dependencias)
removeComponent(build, slotId)          → Build
setRamSlot(build, slotNumber, productId) → Build
setStorageSlot(build, slotKey, productId) → Build
applyPreset(build, slots)               → Build (múltiples slots)
selectCase(build, caseProduct)          → Build
setCaseId(build, caseId)                → Build
clearBuild(build)                       → Build vacío
validateStructure(build)                → boolean
```

---

### 7️⃣ ADAPTERS

#### productsMap.js
```javascript
createProductsMap(array)    → { [id]: producto } (O(1) lookup)
flattenPcParts(pcParts)     → array plano
getProduct(map, id)         → producto | null (nunca rompe)
```

---

### 8️⃣ DATA (Mocks + Config)

#### mockComponentesPc.js
```javascript
PC_PARTS = {
  cpu: [{ id, nombre, marca, precio, nucleos, hilos, velocidad, tdp, socket, ... }, ...],
  gpu: [{ id, nombre, marca, precio, vram, potencia, ... }, ...],
  ram: [{ id, nombre, marca, precio, capacidad, tipo, velocidad, ... }, ...],
  motherboard: [...],
  storage: [...],
  psu: [...],
  case: [...],
  cooling: [...]
}
```

#### mockCelulares.js
```javascript
CELULARES = [
  {
    id, marca, modelo, precio, precioNormal, descuento, imagen,
    specs: {
      pantalla, procesador, ram, almacenamiento, bateria,
      camaraPrincipal, camaraFrontal, resolucion
    }
  },
  ...
]
```

#### slotConfig.js
```javascript
SLOT_CONFIG = [
  { id: 'cpu', label: 'CPU', required: true, multi: false },
  { id: 'motherboard', label: 'Motherboard', required: true, multi: false },
  { id: 'gpu', label: 'GPU', required: false, multi: false },
  { id: 'ram', label: 'RAM', required: true, multi: true, maxSlots: 4 },
  { id: 'storage', label: 'Almacenamiento', required: true, multi: true },
  { id: 'psu', label: 'Fuente', required: true, multi: false },
  { id: 'cooling', label: 'Refrigeración', required: true, multi: false },
  { id: 'case', label: 'Gabinete', required: true, multi: false }
]

PRESETS = [
  { id: 'gaming-high', name: 'Gaming Alto Rendimiento', slots: { cpu: 'id', gpu: 'id', ... } },
  { id: 'workstation', name: 'Workstation', slots: {...} },
  ...
]

PRESETS_META = [
  { id: 'gaming-high', name: 'Gaming Alto Rendimiento', price: 3500, ... },
  ...
]
```

#### compatibility.js
```javascript
checkCompatibility(components) → { warnings: [], errors: [] }

// Valida:
// - Socket CPU ↔ Motherboard
// - Capacidad PSU ≥ consumo total
// - RAM compatibility con motherboard
// - Form factor case ↔ componentes
```

#### caseConfigs.js
```javascript
CASE_CONFIGS = {
  'mid-tower': { ancho, alto, profundidad, soporta: { ... } },
  'mini-tower': { ... },
  'full-tower': { ... }
}
```

#### boardGeometry.js
```javascript
BOARD_GEOMETRY = {
  'atx': { posiciones de slots },
  'micro-atx': { ... },
  'itx': { ... }
}
```

---

## 🔄 FLUJOS DE DATOS PRINCIPALES

### Flujo 1: Autenticación
```
Login.jsx (email, password)
  ↓
authService.login()
  ↓ localStorage.nexus_users
  ↓
{ token, user }
  ↓
AuthContext.login()
  ↓
localStorage.nexus_token, nexus_user
  ↓
useAuth() en todo el app actualizado
```

### Flujo 2: Agregar al Carrito
```
ProductCard / BuilderSlots / ComparadorScreen (onClick agregar)
  ↓
useCart().agregar(producto)
  ↓
CartContext.setItems()
  ↓
localStorage.nexus_cart
  ↓
Navbar renderiza totalItems
```

### Flujo 3: PC Builder
```
PcBuilder.jsx
  ↓
useBuilder() [estado local]
  ↓
BuilderSlots → openModal('cpu')
  ↓
BuilderModal [lista productos]
  ↓
selectPart(part) → setComponent('cpu', productId)
  ↓
builderEngine.setComponent() → Build actualizado
  ↓
useMemo [hydrate + calculate]
  ↓
BuilderSidebar [total, wattage, progreso]
  ↓
Botón "Agregar al carrito"
  ↓
buildToCartItems() → CartItems
  ↓
useCart().agregar() × N
```

### Flujo 4: Checkout
```
Carrito.jsx → "Confirmar compra"
  ↓
¿isAuthenticated?
  ↓ NO
  ├─ CheckoutModal [login form]
  └─ usuario loguea
  ↓ SÍ
  ├─ carritoService.confirmarPedido(items, token)
  ├─ localStorage.nexus_pedidos
  ├─ { pedidoId, total, estado: 'CONFIRMADO' }
  └─ useCart().vaciar()
```

### Flujo 5: Comparador
```
ComparadorPage.jsx
  ↓
useComparador()
  ↓
SelectorCelular (modal)
  ↓
celularService.buscarCelulares(query)
  ↓
usuario selecciona → setSelA / setSelB
  ↓
useMemo [calcularScoresRadar, ventajas, scores]
  ↓
RadarChart, VentajasPanel, EspecsGrid
```

---

## 📊 MATRIZ DE DEPENDENCIAS

```javascript
// main.jsx
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Home, Login, Productos, ... from './pages/*'
import ProtectedRoute from './components/ProtectedRoute'

// pages/Login.jsx
import { login as loginService } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

// pages/PcBuilder.jsx
import { useBuilder } from '../hooks/useBuilder'
import { useCart } from '../context/CartContext'
import { PRESETS_META } from '../data/slotConfig'

// hooks/useBuilder.js
import { PC_PARTS } from '../data/mockComponentesPc'
import { SLOT_CONFIG, PRESETS } from '../data/slotConfig'
import { checkCompatibility } from '../data/compatibility'
import { createBuild, setComponent, ... } from '../domain/builderEngine'
import { hydrateBuild, calculateTotal, ... } from '../services/builderService'

// services/builderService.js
import { getProduct } from '../adapters/productsMap'

// services/productoService.js
import { PC_PARTS } from '../data/mockComponentesPc'
import { flattenPcParts, createProductsMap } from '../adapters/productsMap'

// adapters/productsMap.js
// (sin dependencias internas)

// domain/builderEngine.js
import { createEmptyBuild, SINGLE_SLOTS, ... } from './buildModel'

// context/AuthContext.jsx
import { getUser, getToken, logout as logoutService } from '../services/authService'

// context/CartContext.jsx
// (sin dependencias internas)
```

---

## 🎯 RESUMEN POR RESPONSABILIDAD

### Pages (Componentes de ruta)
- **Home**: Landing page + CTA
- **Login**: Form login + redirect
- **Register**: Form registro
- **Productos**: Catálogo unificado PC + Celulares
- **ProductoDetalle**: Vista detalle individual
- **Carrito**: Resumen carrito + checkout
- **ComparadorPage**: Wrapper del comparador
- **PcBuilder**: Constructor 3D + selector partes
- **Admin/***: Gestión admin (CRUD, pedidos, usuarios)

### Componentes (Reutilizables)
- **Navbar**: Header + navegación + carrito
- **ProductCard**: Card reutilizable
- **ProtectedRoute**: Guard de autenticación
- **CheckoutModal**: Modal pago/login
- **Builder/\***: Componentes 3D del constructor
- **Comparador/\***: Componentes de comparación

### Contextos (Estado global)
- **AuthContext**: Sesión usuario (token, user, login, logout)
- **CartContext**: Carrito (items, agregar, quitar, vaciar)

### Servicios (Lógica negocio + API)
- **authService**: Autenticación (login, register, logout)
- **productoService**: Productos PC (getByCategoria, getById, getAll)
- **celularService**: Celulares (getCelulares, buscarCelulares)
- **builderService**: Cálculos builder (hydrate, total, wattage, progress)
- **comparadorService**: Comparación (radar, ventajas, scores)
- **carritoService**: Confirmación pedido
- **adminService**: CRUD admin

### Hooks (Lógica centralizada)
- **useBuilder**: Estado + métodos del constructor
- **useComparador**: Estado + métodos del comparador

### Domain Logic (Puro)
- **builderEngine**: Manipulación build (setComponent, setRamSlot, etc.)
- **buildModel**: Contrato de estructura del build

### Adapters (Transformación datos)
- **productsMap**: Array ↔ Map conversión

### Data (Mocks + Config)
- **mockComponentesPc**: PC_PARTS (CPU, GPU, RAM, etc.)
- **mockCelulares**: CELULARES
- **slotConfig**: Slots obligatorios/opcionales, presets
- **compatibility**: Reglas de compatibilidad
- **caseConfigs**: Config de gabinetes
- **boardGeometry**: Geometría de motherboards

---

## 📦 PACKAGE.JSON

```json
{
  "name": "nexus",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",           // npm run dev
    "build": "vite build",   // npm run build
    "preview": "vite preview" // npm run preview
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "three": "0.160.0",
    "@react-three/fiber": "^8.16.0",
    "@react-three/drei": "^9.105.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2"
  }
}
```

**Dependencias**:
- **react** + **react-dom**: Framework
- **react-router-dom**: Enrutamiento
- **three** + **@react-three/fiber** + **@react-three/drei**: 3D (builder)
- **vite**: Build tool + dev server
- **@vitejs/plugin-react**: Plugin React para Vite

---

## 🔧 VITE.CONFIG.JS

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**Configuración minimal**:
- Plugin React para JSX
- Defaults de Vite (puerto 5173, HMR, etc.)

---

## 📈 DIAGRAMA DE FLUJO GLOBAL

```
┌─────────────────────────────────────────────────────────────────┐
│                      USUARIO FINAL                              │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┴──────────────────┐
        │                                   │
    ┌───▼────┐                         ┌───▼────┐
    │ PÁGINA │ (Home, Login, Productos)│ HOOK   │ (useBuilder, useComparador)
    └────┬───┘                         └───┬────┘
         │                                 │
         └────────────────┬────────────────┘
                          │
                    ┌─────▼──────┐
                    │  SERVICIO  │ (authService, productoService, etc.)
                    └─────┬──────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    ┌───▼─────┐       ┌───▼────┐       ┌───▼────┐
    │ CONTEXT │       │ DOMAIN │       │ DATA   │
    │ (Auth,  │       │ LOGIC  │       │ (Mocks,│
    │ Cart)   │       │        │       │ Config)│
    └────┬────┘       └───┬────┘       └───┬────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                    ┌─────▼──────────┐
                    │  LOCALSTORAGE  │
                    │  (Persistencia)│
                    └────────────────┘
```

---

## 🚀 FLUJO DE COMPILACIÓN

```
1. npm run dev
   └─ vite dev server (puerto 5173)
   └─ Hot reload on save

2. npm run build
   └─ vite build
   └─ dist/ (optimizado, minificado)

3. npm run preview
   └─ Previsualización local de dist/
```

---

*Documento generado automáticamente - Última actualización: 2026-05-31*
