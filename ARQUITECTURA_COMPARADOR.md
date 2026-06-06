# 🏗️ ARQUITECTURA COMPLETA DEL COMPARADOR - NEXUS

## 📊 FLUJO GENERAL

```
ComparadorPage (wrapper)
    ↓
ComparadorScreen (contenedor principal)
    ├── Navbar
    ├── Background decorativo
    ├── Header + Slots
    ├── RadarChart (gráfico comparativo)
    ├── VentajasPanel (ventajas vs ventajas)
    ├── EspecsGrid (tabla especificaciones)
    └── SelectorCelular (modal selector)
```

---

## 🎯 COMPONENTES Y SU RESPONSABILIDAD

### 1. **ComparadorPage.jsx** (src/pages/)
**Tipo:** Página wrapper  
**Responsabilidad:** Solo contiene el componente principal.  
**Integración:**
```jsx
import ComparadorScreen from '../components/comparador/ComparadorScreen'
export default function ComparadorPage() {
  return <ComparadorScreen />
}
```

---

### 2. **ComparadorScreen.jsx** (src/components/comparador/)
**Tipo:** Componente contenedor principal  
**Responsabilidad:** Gestiona el estado del flujo completo del comparador.

**Estado interno:**
```jsx
const {
  selA, selB,                    // Productos seleccionados
  modalSlot,                     // ¿Qué slot está abierto? ('a', 'b', null)
  busqueda, filtroMarca,         // Filtros del modal
  marcas, productosFiltrados,    // Datos filtrados
  comparacion,                   // Resultado de la comparación
  abrirModal, cerrarModal,       // Control del modal
  seleccionar, limpiarSlot,      // Selecciones
  intercambiar, setBusqueda,     // Acciones
  setFiltroMarca,
} = useComparador()

const { agregar, estaEnCarrito } = useCart()  // Carrito
```

**Render:**
- **Header**: Título + descripción
- **Slots**: SlotCard (A) + "VS" + SlotCard (B)
- **Comparación** (si hay ambos):
  - RadarChart (visualización)
  - VentajasPanel (ventajas)
  - EspecsGrid (specs)
- **Modal**: SelectorCelular (selector de productos)
- **Checkout**: CheckoutModal (compra rápida) que se muestra de forma condicional por slot A/B.
- **SlotCard**: Componente inline que maneja estado vacío/llenado, limpieza, elegir producto, agregar al carrito y compra directa para cada slot.
- Usa `useCart()` para `agregar` y `estaEnCarrito`, controlando el estado del botón de carrito.

---

### 3. **useComparador Hook** (src/hooks/)
**Tipo:** Custom Hook  
**Responsabilidad:** Gestión de estado del comparador (UI state only).

**Estados:**
```javascript
const [selA, setSelA] = useState(null)         // Producto A
const [selB, setSelB] = useState(null)         // Producto B
const [modalSlot, setModalSlot] = useState(null)
const [busqueda, setBusqueda] = useState('')
const [filtroMarca, setFiltroMarca] = useState('Todas')
```

**Computed (useMemo):**
- `marcas`: Array único de marcas ordenadas
- `productosFiltrados`: Filtra por marca + búsqueda + excluye el otro slot
- `comparacion`: Llama al service para calcular scores, ventajas, etc.
- `useEffect` carga el catálogo de celulares con `getCelulares()` y normaliza cada producto antes de usarlo.

**Acciones:**
```javascript
abrirModal(slot)      // Abre selector para 'a' o 'b'
cerrarModal()         // Cierra selector
seleccionar(producto) // Guarda producto en slot abierto
limpiarSlot(slot)     // Borra producto del slot
intercambiar()        // Intercambia A ↔ B
```

---

### 4. **comparadorService.js** (src/services/)
**Tipo:** Servicio de lógica pura  
**Responsabilidad:** Cálculos de comparación, SIN React ni UI.

**Funciones exportadas:**

#### `calcularScoresRadar(prodA, prodB)`
Calcula scores (0-100) para cada eje comparado:
- **Rendimiento**: Score del procesador (PROCESSOR_SCORES)
- **Pantalla**: Resolución + tamaño
- **Cámaras**: Megapíxeles + factor de optimización
- **Batería**: mAh comparados
- **Memoria**: RAM + almacenamiento
- **Valor**: Relación precio/specs

Retorna:
```javascript
{
  rendimiento: { a: 85, b: 70 },
  pantalla:    { a: 90, b: 88 },
  camaras:     { a: 92, b: 80 },
  bateria:     { a: 75, b: 85 },
  memoria:     { a: 80, b: 70 },
  valor:       { a: 60, b: 75 }
}
```

#### `calcularVentajas(prodA, prodB)`
Extrae ventajas claras de cada producto.

Retorna array:
```javascript
[
  {
    campo: 'camaraPrincipal',
    ganador: 'a',
    labelA: '108MP',
    labelB: '50MP'
  },
  ...
]
```

#### `calcularScoreGlobal(prodA, prodB)`
Score final (0-100) considerando todos los ejes ponderados.

#### Helpers internos:
- `getProcessorScore(procesador)`: Mapea string del procesador a score (0-100)
- `getFactorOptimizacionCamara(producto)`: Factor según marca/procesador
- `parseMegapixels(camaraStr)`: Extrae número de string
- `parseBateria(bateriaStr)`: Extrae mAh
- `normalizar(valor, min, max)`: Normaliza a 0-100

---

### 5. **SelectorCelular.jsx** (src/components/comparador/)
**Tipo:** Componente presentacional (modal)  
**Responsabilidad:** UI del selector, recibe datos filtrados ya hechos.

**Props:**
```jsx
{
  open,                // boolean: ¿mostrar?
  slot,                // 'a' | 'b'
  productos,           // Array ya filtrado
  busqueda,
  filtroMarca,
  marcas,
  onBusqueda,          // callback
  onMarca,             // callback
  onSelect,            // callback cuando elige
  onClose              // callback para cerrar
}
```

**Render:**
- **Header**: Cierre + título
- **Búsqueda**: Input con placeholder
- **Filtro Marcas**: Pills (botones) de marcas
- **Lista**: Items de productos con imagen + info + precio
- **Comportamiento**: clic en overlay cierra el modal; el panel interno detiene la propagación para evitar cerrar al interactuar con el contenido.

**CSS Classes:**
```css
.sel-overlay   /* Fondo oscuro/overlay */
.sel-panel     /* Modal container */
.sel-header    /* Encabezado */
.sel-search    /* Búsqueda */
.sel-marcas    /* Pills de marcas */
.sel-marca-pill
.sel-list      /* Lista de items */
.sel-item      /* Item individual */
.sel-item-img
.sel-item-info
.sel-item-marca
.sel-item-modelo
.sel-item-color
.sel-item-precio
```

---

### 6. **RadarChart.jsx** (src/components/comparador/)
**Tipo:** Componente presentacional (gráfico)  
**Responsabilidad:** Renderiza gráfico de radar en SVG.

**Props:**
```jsx
{
  scores,    // Object { rendimiento: {a, b}, pantalla: {a, b}, ... }
  colorA,    // Color producto A (ej: '#00e5ff')
  colorB,    // Color producto B (ej: '#ff3c5f')
  nombreA,   // Nombre para leyenda
  nombreB    // Nombre para leyenda
}
```

**Ejes del radar** (constante EJES):
1. Rendimiento
2. Pantalla
3. Cámara
4. Batería
5. Memoria
6. Valor

**Render (SVG puro):**
- Centro: CX=210, CY=210, Radio=155px
- Ángulos: 360° / 6 ejes = 60° cada uno
- 2 polígonos (A en colorA, B en colorB)
- Grid de fondo (5 niveles: 20%, 40%, 60%, 80%, 100%)
- Etiquetas en cada eje
- Leyenda

---

### 7. **EspecsGrid.jsx** (src/components/comparador/)
**Tipo:** Componente presentacional (tabla)  
**Responsabilidad:** Muestra specs lado a lado, resalta ganador.

**Props:**
```jsx
{
  prodA,   // Producto A
  prodB,   // Producto B
  colorA,  // Color A
  colorB   // Color B
}
```

**Filas** (FILAS const):
```javascript
[
  { key: 'pantalla',        label: 'Pantalla' },
  { key: 'resolucion',      label: 'Resolución' },
  { key: 'procesador',      label: 'Procesador' },
  { key: 'ram',             label: 'RAM' },
  { key: 'almacenamiento',  label: 'Almacenamiento' },
  { key: 'camaraPrincipal', label: 'Cámara principal' },
  { key: 'camaraFrontal',   label: 'Cámara frontal' },
  { key: 'bateria',         label: 'Batería' },
  { key: 'so',              label: 'Sistema operativo' },
  { key: 'tieneNfc',        label: 'NFC' },
  { key: 'tiene5g',         label: '5G' }
]
```
- También muestra una fila de precio con ganador destacado.
- El componente compara booleans, extrae números de strings y resalta la celda ganadora con `specs-winner`.

**Lógica ganador** (`ganadorFila(key, specA, specB)`):
- Booleanos: true gana
- Números: mayor gana
- Strings con números: extrae primer número

**CSS Classes:**
```css
.specs-grid-wrap
.specs-grid
.specs-row
.specs-label
.specs-val-a   /* Celda A */
.specs-val-b   /* Celda B */
.specs-winner  /* Ganador resaltado */
```

---

### 8. **VentajasPanel.jsx** (src/components/comparador/)
**Tipo:** Componente presentacional  
**Responsabilidad:** Muestra ventajas de cada producto lado a lado.

**Props:**
```jsx
{
  ventajas,    // Array ya calculado: { campo, ganador: 'a'|'b', labelA, labelB }
  nombreA,     // Nombre producto A
  nombreB,     // Nombre producto B
  colorA,      // Color A
  colorB       // Color B
}
```

**Render:**
- Columna A (colorA): "¿En qué es mejor [nombreA]?"
  - Lista de ventajas donde ganador === 'a'
- Columna B (colorB): "¿En qué es mejor [nombreB]?"
  - Lista de ventajas donde ganador === 'b'

**Sub-componente VentajaItem:**
```jsx
{
  ventaja,
  color,
  labelPropio,   // El valor ganador
  labelRival     // El valor perdedor
}
```

**CSS Classes:**
```css
.ventajas-wrap
.ventajas-col
.ventajas-title
.ventajas-empty
.ventaja-item
.ventaja-campo  /* Nombre del campo */
.ventaja-valor  /* Valor resaltado */
.ventaja-rival  /* Comparación */
```

---

### 9. **SlotCard.jsx** (función dentro de ComparadorScreen)
**Tipo:** Sub-componente funcional  
**Responsabilidad:** Renderiza cada slot (A o B).

**Props:**
```jsx
{
  producto,      // null si vacío
  color,         // Color tema del slot
  lado,          // 'A' o 'B'
  score,         // Número si hay comparación, null si no
  enCarrito,     // boolean
  onElegir,      // callback: abre selector
  onLimpiar,     // callback: elimina producto
  onCarrito,     // callback: agrega carrito
  onComprar      // callback: abre checkout
}
```

**Estados:**
- **Vacío**: Botón grande con + (onElegir)
- **Lleno**: 
  - Botones: Comprar, Carrito
  - Imagen del producto
  - Info: marca, modelo, storage, color, precio, descuento
  - Score (si hay comparación)
  - Botón "Cambiar"

**CSS Classes:**
```css
.comp-slot
.comp-slot-empty       /* Estado vacío */
.comp-slot-plus        /* Símbolo + */
.comp-slot-filled      /* Estado lleno */
.comp-slot-clear       /* Botón X */
.comp-slot-actions     /* Botones */
.comp-slot-buy
.comp-slot-cart
.comp-slot-img-wrap
.comp-slot-img
.comp-slot-img-glow
.comp-slot-info
.comp-slot-marca
.comp-slot-modelo
.comp-slot-storage
.comp-slot-precio
.comp-slot-desc        /* Descuento */
.comp-slot-score
.comp-slot-score-num
.comp-slot-score-label
.comp-slot-change
```

---

## 🎨 ESTILOS CSS (comparador.css)

### Secciones principales:

#### 1. **PAGE CONTAINER**
```css
.comp-page { min-height: 100vh; padding-top: 60px; }
```

#### 2. **BACKGROUND DECORATIVO**
```css
.comp-bg              /* Fixed overlay */
.comp-bg-grid         /* Grid repetido */
.comp-bg-orb          /* Orbs decorativos (2) */
.comp-bg-orb-a        /* 600x600, top-left */
.comp-bg-orb-b        /* 500x500, bottom-right */
```

#### 3. **HEADER**
```css
.comp-header          /* Contenedor */
.comp-title           /* Título grande */
.comp-title-outline   /* Efecto outline */
.comp-eyebrow         /* Texto superior */
.comp-subtitle        /* Descripción */
```

#### 4. **SLOTS GRID**
```css
.comp-slots           /* grid: 1fr auto 1fr */
.comp-slot            /* Item individual */
.comp-slot-empty      /* Vacío */
.comp-slot-filled     /* Lleno */
```

#### 5. **VS SEPARATOR**
```css
.comp-vs              /* Flex column, center */
.comp-vs-text         /* "VS" grande */
.comp-swap-btn        /* Botón intercambiar */
```

#### 6. **RESULT SECTION**
```css
.comp-result          /* Contenedor comparación */
.comp-radar-ventajas  /* Grid: radar + ventajas */
.comp-radar-wrap
.comp-ventajas-wrap
.comp-specs-wrap
```

#### 7. **EMPTY STATE**
```css
.comp-empty           /* Sin productos seleccionados */
.comp-empty-icon
.comp-empty-text
```

#### 8. **RESPONSIVE**
```css
/* Adapta a mobile: cambia grid de 3 columnas a 1 */
@media (max-width: 768px) {
  .comp-slots { grid-template-columns: 1fr; }
  /* ... */
}
```

---

## 🔄 FLUJO DE DATOS Y ACCIONES

### 1️⃣ **Usuario abre comparador**
```
ComparadorPage → ComparadorScreen
  → useComparador hook inicializa (selA=null, selB=null, modal=null)
```

### 2️⃣ **Usuario hace clic en "Elegir celular A"**
```
onElegir('a')
  → abrirModal('a')
    → setModalSlot('a')
    → abre SelectorCelular
```

### 3️⃣ **SelectorCelular se abre**
```
Props recibe:
  - productos: CELULARES filtrados (excluye selB)
  - marcas: lista de marcas
  - búsqueda, filtroMarca vacíos
```

### 4️⃣ **Usuario busca/filtra**
```
onBusqueda(valor)  → setBusqueda
onMarca(valor)     → setFiltroMarca
  → useComparador recalcula productosFiltrados (useMemo)
  → SelectorCelular re-renders con nuevos productos
```

### 5️⃣ **Usuario selecciona producto**
```
onSelect(producto)
  → seleccionar(producto)
    → setSelA(producto)  [o setSelB si modalSlot='b']
    → cerrarModal()
```

### 6️⃣ **Ambos slots tienen producto → Comparación**
```
tieneAmbos = selA && selB = true
  → useMemo calcula:
    comparacion = {
      scores: calcularScoresRadar(selA, selB),
      ventajas: calcularVentajas(selA, selB),
      scoreGlobalA: calcularScoreGlobal(selA, selB),
      scoreGlobalB: calcularScoreGlobal(selB, selA)
    }
  
  → Aparecen:
    - RadarChart (recibe scores)
    - VentajasPanel (recibe ventajas)
    - EspecsGrid (recibe prodA, prodB)
    - Score en cada SlotCard
```

### 7️⃣ **Usuario agrega al carrito**
```
onCarrito()
  → agregar() (useCart)
    → CartContext guarda producto
```

### 8️⃣ **Usuario compra**
```
onComprar()
  → setCheckoutSlot('a')  [o 'b']
  → CheckoutModal abre
```

---

## 📦 INTEGRACIONES EXTERNAS

### **CartContext** (useCart)
```javascript
const { agregar, estaEnCarrito } = useCart()

// Usar:
agregar({
  id, nombre, marca, precio, imagen, categoria
})

estaEnCarrito(id)  // boolean
```

### **CheckoutModal**
```jsx
<CheckoutModal
  items={[{ nombre, precio }]}
  total={numero}
  onClose={callback}
/>
```

### **Navbar**
```jsx
<Navbar />
```

### **Data Source**
```javascript
import { CELULARES } from '../data/mockCelulares'

// Array de objetos:
[
  {
    id, marca, modelo, precio, imagen, color, storage, descuento,
    specs: { procesador, pantalla, resolucion, ram, ... }
  },
  ...
]
```

---

## 🎯 SUMMARY - QUIÉN INTEGRA QUIÉN

```
ComparadorPage (wrapper)
  └─ ComparadorScreen (PRINCIPAL)
      ├─ useComparador() ────────────────────┐
      │                                       │
      ├─ Navbar                               │
      │                                       ├─ Maneja STATE
      ├─ SlotCard (A, B) ◄─ selA, selB      │
      │                                       │
      ├─ SelectorCelular ◄─ modalSlot       │
      │   ├─ Recibe: productosFiltrados     │
      │   └─ Callback: onSelect             │
      │                                       │
      ├─ RadarChart ◄─ comparacion.scores   ├─ Consume COMPARACIÓN
      │   └─ Recibe: scores, colores        │
      │                                       │
      ├─ VentajasPanel ◄─ comparacion       │
      │   └─ Recibe: ventajas, colores      │
      │                                       │
      ├─ EspecsGrid ◄─ selA, selB           │
      │   └─ Recibe: productos, colores     │
      │                                       │
      └─ CheckoutModal                       │
          └─ Recibe: items, total           │
                                             └─

┌─── COMPARADOR SERVICE (Lógica pura) ───┐
│ calcularScoresRadar(A, B)              │
│ calcularVentajas(A, B)                 │
│ calcularScoreGlobal(A, B)              │
└────────────────────────────────────────┘
```

---

## 🎨 COLORES TEMÁTICOS

```javascript
const COLOR_A = '#00e5ff'  // Cyan brillante
const COLOR_B = '#ff3c5f'  // Rosa/Rojo
```

Cada slot tiene su color:
- Línea superior del slot
- Botones (borde + hover)
- Gráfico radar (polígono A)
- Panel ventajas (título + resaltados)
- Score numérico

---

## 📊 FLUJO CSS CASCADE

```css
Body/Global
  ↓
.comp-page
  ├─ .comp-bg (fixed overlay)
  ├─ .comp-header
  ├─ .comp-slots (grid 3 cols)
  │   ├─ .comp-slot-empty (vacío)
  │   ├─ .comp-slot-filled (lleno)
  │   │   ├─ .comp-slot-actions
  │   │   ├─ .comp-slot-img-wrap
  │   │   ├─ .comp-slot-info
  │   │   └─ .comp-slot-score
  │   └─ .comp-vs
  ├─ .comp-result
  │   ├─ .comp-radar-wrap (SVG)
  │   ├─ .ventajas-wrap
  │   └─ .specs-grid-wrap
  └─ .sel-overlay (SelectorCelular modal)
      └─ .sel-panel
```

---

## 🚀 OPTIMIZACIONES

1. **useMemo**: `productosFiltrados`, `comparacion` (re-render solo si deps cambian)
2. **useCallback**: `abrirModal`, `cerrarModal`, `seleccionar`, etc. (evita re-renders de hijos)
3. **SVG puro**: RadarChart sin librerías externas (rendimiento)
4. **CSS Grid**: Layout eficiente de slots
5. **Lazy rendering**: Comparación solo si `tieneAmbos === true`
