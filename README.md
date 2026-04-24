

# NEXUS — Tienda de Tecnología

Plataforma de comercio electrónico especializada en tecnología con PC Builder interactivo y comparador de celulares.

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | React 18 + Vite |
| 3D *(producción)* | Three.js + React Three Fiber |
| Backend *(producción)* | Spring Boot 4 + Java 17 |
| Base de datos *(producción)* | Oracle 18 XE |
| Autenticación *(producción)* | JWT + Spring Security |

> **Nota:** Este es el prototipo navegable del frontend. El backend y la base de datos están definidos en la arquitectura pero no son requeridos para ejecutar el prototipo — todo funciona con datos mock.

---

## Requisitos previos

### Prototipo (solo frontend)
- Node.js 18 o superior
- npm 9 o superior

### Versión completa *(cuando el backend esté integrado)*
- Java 17 (Microsoft OpenJDK 17 recomendado)
- Maven 3.8+
- Oracle Database XE 18c con usuario `erick1` y PDB `XEPDB1`

---

## Instalación y despliegue

### Prototipo — solo frontend

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd nexus

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

### Versión completa *(con backend)*

```bash
# 1. Iniciar el backend
cd proyectoNEXUS
./mvnw spring-boot:run
# Disponible en http://localhost:8080

# 2. Iniciar el frontend
cd nexus
npm install
npm run dev
# Disponible en http://localhost:5173
```

---

## Pantallas del sistema

| Ruta | Pantalla | Acceso |
|------|----------|--------|
| `/` | Home | Público |
| `/login` | Iniciar sesión | Público |
| `/register` | Crear cuenta | Público |
| `/productos` | Catálogo de celulares | Público |
| `/comparador` | Comparador de celulares | Público |
| `/pc-builder` | PC Builder | Requiere login |
| `/carrito` | Carrito de compras | Público |

---

## Roles de usuario

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| `ROLE_USER` | Usuario registrado | Catálogo, PC Builder, Comparador, Carrito |
| `ROLE_ADMIN` | Administrador | Todo lo anterior + gestión de productos *(backend)* |

---

## Credenciales de prueba

El prototipo usa autenticación mock con `localStorage`. Para probar:

1. Ir a `/register`
2. Crear cuenta con cualquier email y contraseña (mínimo 6 caracteres)
3. Iniciar sesión en `/login`
4. Acceder a `/pc-builder`

---

## Endpoints del API *(backend — producción)*

### Autenticación
```
POST /api/auth/register   → Registrar usuario
POST /api/auth/login      → Iniciar sesión → devuelve JWT
```

### Productos
```
GET /api/productos                        → Todos los productos
GET /api/productos/categoria/{categoria}  → Por categoría
```

---

## Estructura del proyecto

```
nexus/                          ← Frontend React (prototipo)
├── src/
│   ├── context/                ← AuthContext global
│   ├── domain/                 ← Lógica pura del builder
│   ├── adapters/               ← Transformación de datos
│   ├── services/               ← Comunicación con API (USE_MOCK=true)
│   ├── data/                   ← Mock data temporal
│   ├── hooks/                  ← Custom hooks
│   ├── components/             ← Componentes reutilizables
│   └── pages/                  ← Páginas de la app
└── public/modelos/             ← Modelos 3D .glb (producción)



proyectoNEXUS/                  ← Backend Spring Boot (producción)
└── src/main/java/org/nexus/backend/
    ├── controller/             ← Endpoints HTTP
    ├── service/                ← Lógica de negocio
    ├── repository/             ← Acceso a Oracle
    ├── model/entity/           ← Entidades JPA
    ├── dto/                    ← Contratos de API
    └── security/               ← JWT + Spring Security
```

---

## Variables de entorno *(backend — producción)*

El archivo `application.properties` contiene la configuración de la base de datos:

```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521/XEPDB1
spring.datasource.username=erick1
spring.datasource.password=123456
jwt.secret=nexus2026clavesecretamuylargoparaqueseasegura
jwt.expiration=86400000
```

> ⚠️ En producción estas credenciales deben moverse a variables de entorno.

---

## Notas del prototipo

- Todos los datos son **mock** — no requiere backend para ejecutarse.
- La autenticación es simulada via `localStorage`. En producción se integra con Spring Boot + JWT.
- El visualizador 3D del PC Builder requiere los archivos `.glb` en `/public/modelos/` — desactivado en el prototipo.
- El campo `USE_MOCK = true` en cada service controla el cambio a backend real sin tocar más código.

---

*Proyecto universitario — Ingeniería de Software 2026*
