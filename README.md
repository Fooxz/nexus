Nexus — Tienda y PC Builder (React + Vite)

Proyecto frontend para una tienda de componentes y un constructor de PC. Incluye páginas de catálogo, detalle de producto, carrito, comparador de móviles y un constructor 3D de PCs con modelos GLB en `public/modelos`.

**Tecnologías principales**
- React
- Vite
- Context API para autenticación y carrito (`src/context`)
- Componentes 3D (modelos `.glb` en `public/modelos`) para el `PcBuilder`

**Estructura principal**
- `public/`: recursos estáticos (imágenes, modelos 3D `.glb`, `vite.svg`).
- `src/`: código fuente (componentes, páginas, servicios, context, datos y estilos).

**Carpetas relevantes**
- `src/pages/`: páginas de la aplicación (rutas principales).
- `src/components/`: componentes reutilizables (Navbar, Footer, ProductCard, Builder UI, Comparador, etc.).
- `src/context/`: `AuthContext.jsx`, `CartContext.jsx` (estado global).
- `src/services/`: abstracciones para llamadas/operaciones (productos, carrito, auth, builder, comparador).
- `src/data/`: datos mock y configuraciones de slots para el builder.
- `public/modelos/`: modelos 3D por categoría (cpu, gpu, ram, psu, storage, cases, cooling, motherboards).

**Páginas (por archivo) y qué contienen**
- `src/pages/Home.jsx` — Página principal: banner, carrusel de destacados (`FeaturedCarousel`), secciones de productos y enlaces rápidos a categorías.
- `src/pages/Productos.jsx` — Listado/tienda: muestra productos filtrables/ordenables, usa `ProductCard` y consume `productoService` para obtener datos.
- `src/pages/ProductoDetalle.jsx` — Detalle de producto: galería, descripción, especificaciones, botón para añadir al carrito que actualiza `CartContext`.
- `src/pages/Carrito.jsx` — Carrito de compras: lista de items, resumen de totales, acciones de cantidad/eliminar y checkout via `carritoService`.
- `src/pages/ComparadorPage.jsx` — Interfaz de comparación: selecciona modelos (móviles) con `SelectorCelular`, muestra `EspecsGrid` y `RadarChart`, usa `comparadorService`.
- `src/pages/PcBuilder.jsx` — Constructor de PC: interfaz visual y slots (`BuilderSidebar`, `BuilderSlots`, `PcScene`), usa `builderEngine` y `builderService` para validar compatibilidades y generar builds; carga modelos 3D desde `public/modelos`.
- `src/pages/Login.jsx` — Form de inicio de sesión: usa `authService` y `AuthContext` para manejar sesión.
- `src/pages/Register.jsx` — Registro de usuario: formulario y llamadas a `authService`.

**Cómo se conectan las páginas entre sí**
- `main.jsx` monta la aplicación y el ruteo principal (React Router). `Navbar` contiene enlaces a `Home`, `Productos`, `Carrito`, `PcBuilder` y `Comparador`.
- `ProtectedRoute.jsx` envuelve rutas que requieren autenticación (p. ej. checkout o páginas de usuario), consultando `AuthContext`.
- `CartContext` provee funciones `addItem`, `removeItem`, `updateQty` y estado compartido entre `ProductoDetalle`, `ProductCard` y `Carrito`.
- `AuthContext` mantiene el estado de usuario y token; `Login` y `Register` actualizan el contexto.
- `PcBuilder` usa `domain/builderEngine.js` y `data/slotConfig.js` para validar compatibilidades y actualizar la vista 3D en `PcScene`.
- Los servicios en `src/services/*.js` encapsulan la lógica de negocio y las operaciones sobre los datos (pueden apuntar a APIs reales o usar mocks de `src/data`).

**Flujo típico de usuario**
1. El usuario entra en `Home` y navega a `Productos` desde `Navbar`.
2. Desde `Productos` abre `ProductoDetalle` y añade un producto al carrito (actualiza `CartContext`).
3. El usuario va a `Carrito`, revisa el pedido y procede al checkout (posible ruta protegida por `ProtectedRoute`).
4. Alternativamente, el usuario abre `PcBuilder` para armar una PC y guarda/añade la configuración al carrito.
5. En `ComparadorPage` compara dispositivos (p. ej. móviles) usando datos de `mockCelulares` o `comparadorService`.

**Cómo ejecutar (desarrollo)**
```bash
npm install
npm run dev
```

**Notas para desarrolladores**
- Los modelos 3D grandes están en `public/modelos`; mantener la estructura por carpetas para que `PcScene` pueda cargarlos dinámicamente.
- Para pruebas rápidas, `src/data/mockComponentesPc.js` y `src/data/mockCelulares.js` contienen datos locales.
- Si añades nuevas rutas, registra los componentes en el ruteador de `App.jsx`/`main.jsx` y actualiza `Navbar.jsx`.

Si quieres, puedo: listar el contenido de cada archivo de `src/pages/` completo, generar diagramas de conexión entre páginas, o añadir secciones de documentación detallada por componente.
