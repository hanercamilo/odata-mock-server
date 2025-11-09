# 🚀 OData Mock Server

> Mock completo de **OData v4** en Node.js para desarrollo y testing de aplicaciones JavaScript sin necesidad de un backend real en C#/.NET

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-blue.svg)](https://expressjs.com/)
[![OData](https://img.shields.io/badge/OData-v4-orange.svg)](https://www.odata.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Instalación](#-instalación)
- [Inicio Rápido](#-inicio-rápido)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Query Options](#-query-options-soportadas)
- [Ejemplos de Uso](#-ejemplos-de-uso)
- [Modelo de Datos](#-modelo-de-datos)
- [Deploy en Vercel](#-deploy-en-vercel)
- [Desarrollo](#-desarrollo)

---

## ✨ Características

### 🎯 Core OData v4
- ✅ **EntitySets Discovery** - Lista de todas las entidades disponibles
- ✅ **$metadata** - Schema EDM completo con tipos y navegación
- ✅ **Query Options** - Filtrado, ordenamiento, paginación y selección
- ✅ **$expand** - Expansión de relaciones con soporte multinivel
- ✅ **Navigation Properties** - Navegación completa entre entidades relacionadas

### 🔍 Filtrado Avanzado
- ✅ Operadores de comparación: `eq`, `ne`, `gt`, `lt`, `ge`, `le`
- ✅ Funciones de string: `contains`, `startswith`, `endswith`
- ✅ **Filtros navegados**: `Empleado/Persona/nombre`
- ✅ Filtros en propiedades anidadas: `Cliente/ciudad`

### 🎨 Expansión Sofisticada
- ✅ Expansión simple: `$expand=Empleado`
- ✅ Con selección: `$expand=Empleado($select=id,cargo)`
- ✅ Multinivel: `$expand=Empleado($expand=Persona($expand=TipoDocumento))`
- ✅ Múltiples expansiones: `$expand=Empleado,Cliente,Productos`

### 📊 Datos Mock Realistas
- ✅ **200+ registros** por tabla
- ✅ Relaciones íntegras garantizadas
- ✅ Datos en español (nombres, ciudades colombianas)
- ✅ Generador automático incluido

### 🌐 Deploy Flexible
- ✅ Compatible con **Vercel**, **Netlify**, **Railway**
- ✅ Funciones serverless listas
- ✅ CORS habilitado
- ✅ Zero-config deployment

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/hanercamilo/odata-mock-server.git
cd odata-mock-server

# Instalar dependencias
npm install

# Generar datos mock (200+ registros por tabla)
node generate-mock-data.js

# Iniciar servidor
npm start
```

El servidor estará disponible en `http://localhost:4000/odata`

---

## ⚡ Inicio Rápido

### 1️⃣ Listar entidades disponibles
```bash
GET http://localhost:4000/odata
```

**Respuesta:**
```json
{
  "@odata.context": "http://localhost:4000/odata/$metadata",
  "value": [
    { "name": "Personas", "kind": "EntitySet", "url": "Personas" },
    { "name": "Empleados", "kind": "EntitySet", "url": "Empleados" },
    { "name": "Clientes", "kind": "EntitySet", "url": "Clientes" },
    { "name": "Productos", "kind": "EntitySet", "url": "Productos" },
    { "name": "Ventas", "kind": "EntitySet", "url": "Ventas" },
    { "name": "TipoDocumentos", "kind": "EntitySet", "url": "TipoDocumentos" }
  ]
}
```

### 2️⃣ Consultar el metadata (schema EDM)
```bash
GET http://localhost:4000/odata/$metadata
```

**Respuesta:** XML con el schema completo incluyendo:
- Tipos de entidades (EntityType)
- Propiedades y sus tipos
- Claves primarias (Key)
- Propiedades de navegación (NavigationProperty)
- Relaciones y constraints

### 3️⃣ Consulta básica
```bash
GET http://localhost:4000/odata/Personas
```

---

## 📁 Estructura del Proyecto

```
odata-mock-server/
├── api/
│   └── server.js                # Servidor Express principal
├── generate-mock-data.js        # Generador de datos mock
├── package.json
├── README.md
├── data/
│   ├── odata.json              # Lista de EntitySets
│   ├── metadata.xml            # Schema EDM
│   └── entities/               # Datos JSON por entidad
│       ├── Personas.json
│       ├── Empleados.json
│       ├── Clientes.json
│       ├── Productos.json
│       ├── Ventas.json
│       └── TipoDocumentos.json
└── vercel.json                 # Config para deploy en Vercel
```

---

## 🌐 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/odata` | Lista de EntitySets disponibles |
| `GET` | `/odata/$metadata` | Schema EDM completo (XML) |
| `GET` | `/odata/{EntitySet}` | Consultar entidad con query options |

---

## 🔧 Query Options Soportadas

### `$count` - Contador de registros
```http
GET /odata/Ventas?$count=true
```
Retorna `@odata.count` con el total de registros

### `$top` - Limitar resultados
```http
GET /odata/Productos?$top=10
```
Retorna solo los primeros 10 registros

### `$skip` - Paginación
```http
GET /odata/Personas?$skip=20&$top=10
```
Salta los primeros 20 y retorna los siguientes 10 (página 3)

### `$orderby` - Ordenamiento
```http
GET /odata/Ventas?$orderby=total desc
GET /odata/Personas?$orderby=nombre asc
```
Ordena por campo en orden ascendente o descendente

### `$select` - Selección de campos
```http
GET /odata/Empleados?$select=id,nombre,cargo
```
Retorna solo los campos especificados

### `$filter` - Filtrado

#### Operadores de comparación
```http
# Igual a
GET /odata/Ventas?$filter=total eq 5000000

# Mayor que
GET /odata/Ventas?$filter=total gt 2000000

# Menor o igual
GET /odata/Productos?$filter=precio le 1000000

# Diferente de
GET /odata/Personas?$filter=edad ne 30
```

#### Funciones de string
```http
# Contiene
GET /odata/Personas?$filter=contains(nombre, 'juan')

# Empieza con
GET /odata/Clientes?$filter=startswith(nombre, 'Acme')

# Termina con
GET /odata/Productos?$filter=endswith(nombre, 'Pro')
```

#### Filtros navegados 🔥
```http
# Filtrar por propiedad de entidad relacionada
GET /odata/Ventas?$filter=contains(Empleado/Persona/nombre, 'carlos')

# Filtrar por ciudad del cliente
GET /odata/Ventas?$filter=contains(Cliente/ciudad, 'Bogotá')

# Filtrar por área del empleado
GET /odata/Ventas?$filter=Empleado/area eq 'Tecnología'
```

### `$expand` - Expansión de relaciones

#### Expansión simple
```http
GET /odata/Ventas?$expand=Empleado
```

#### Expansión con selección de campos
```http
GET /odata/Ventas?$expand=Empleado($select=id,cargo,salario)
```

#### Expansión multinivel
```http
GET /odata/Empleados?$expand=Persona($expand=TipoDocumento)
```

#### Múltiples expansiones
```http
GET /odata/Ventas?$expand=Empleado,Cliente,Producto
```

#### Expansión compleja (combinada) 🚀
```http
GET /odata/Ventas?$expand=Empleado($select=id,cargo;$expand=Persona($expand=TipoDocumento)),Cliente($select=id,nombre),Productos($select=nombre,precio)
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Búsqueda y paginación básica
```http
GET /odata/Personas?$count=true&$top=20&$orderby=nombre asc&$select=id,nombre,correo
```

**Caso de uso:** Mostrar una lista paginada de personas ordenadas alfabéticamente

---

### Ejemplo 2: Dashboard de ventas
```http
GET /odata/Ventas?$count=true&$top=10&$filter=total gt 2000000&$orderby=total desc&$select=id,fecha,total
```

**Caso de uso:** Top 10 ventas mayores a $2,000,000

---

### Ejemplo 3: Reporte completo con relaciones 🔥
```http
GET /odata/Ventas?$count=true
  &$top=10
  &$filter=total gt 2000000
  &$expand=Empleado($select=id,cargo;$expand=Persona($expand=TipoDocumento)),Cliente($select=id,nombre;$expand=Persona($expand=TipoDocumento)),Productos($select=id,nombre,precio)
  &$orderby=total desc
```

**Respuesta:**
```json
{
  "@odata.context": "http://localhost:4000/odata/$metadata#Ventas",
  "@odata.count": 87,
  "value": [
    {
      "id": 42,
      "fecha": "2025-08-15",
      "cantidad": 3,
      "total": 15600000,
      "Empleado": {
        "id": 12,
        "cargo": "Ejecutivo de Ventas",
        "Persona": {
          "id": 12,
          "nombre": "Carlos Martínez",
          "numeroDocumento": "79856123",
          "edad": 34,
          "correo": "carlos.martinez@mail.com",
          "TipoDocumento": {
            "id": 1,
            "codigo": "CC",
            "descripcion": "Cédula de Ciudadanía"
          }
        }
      },
      "Cliente": {
        "id": 8,
        "nombre": "TechCorp SAS",
        "Persona": {
          "nombre": "María López",
          "TipoDocumento": {
            "codigo": "NIT"
          }
        }
      },
      "Productos": [
        {
          "id": 15,
          "nombre": "MacBook Pro 16",
          "precio": 5200000
        }
      ]
    }
  ]
}
```

**Caso de uso:** Reporte de ventas grandes con información completa del vendedor, cliente y productos

---

### Ejemplo 4: Búsqueda avanzada con filtros navegados
```http
GET /odata/Ventas?$filter=contains(Empleado/Persona/nombre, 'juan') and total gt 1000000&$expand=Empleado($expand=Persona)
```

**Caso de uso:** Todas las ventas mayores a $1M realizadas por empleados llamados Juan

---

### Ejemplo 5: Consulta de inventario
```http
GET /odata/Productos?$filter=stock lt 10&$orderby=stock asc&$select=id,nombre,stock,precio
```

**Caso de uso:** Productos con bajo inventario para reabastecimiento

---

## 🗄️ Modelo de Datos

```
┌─────────────────┐
│ TipoDocumentos  │
│─────────────────│
│ id (PK)         │◄────┐
│ codigo          │     │
│ descripcion     │     │
└─────────────────┘     │
                        │
┌─────────────────┐     │
│    Personas     │     │
│─────────────────│     │
│ id (PK)         │     │
│ tipoDocumentoId │─────┘ (FK)
│ numeroDocumento │
│ nombre          │
│ edad            │
│ correo          │
└─────────────────┘
         ▲
         │
    ┌────┴────┐
    │         │
┌───┴─────┐ ┌─┴──────────┐
│Empleados│ │  Clientes  │
│─────────│ │────────────│
│ id (PK) │ │ id (PK)    │
│personaId│ │ nombre     │
│ cargo   │ │ nit        │
│ salario │ │ ciudad     │
│ area    │ │ contacto   │
└─────────┘ └────────────┘
     │             │
     │             │
     │      ┌──────┴─────────┐
     │      │                │
┌────┴──────▼─────┐   ┌──────▼─────┐
│     Ventas      │   │ Productos  │
│─────────────────│   │────────────│
│ id (PK)         │   │ id (PK)    │
│ empleadoId (FK) │   │ nombre     │
│ clienteId (FK)  │   │ categoria  │
│ productoId (FK) │──►│ precio     │
│ fecha           │   │ stock      │
│ cantidad        │   └────────────┘
│ total           │
└─────────────────┘
```

### Estadísticas de Datos Mock

| Entidad | Registros | Descripción |
|---------|-----------|-------------|
| **TipoDocumentos** | 4 | CC, TI, CE, NIT |
| **Personas** | 200 | Nombres, documentos, contactos |
| **Empleados** | 200 | Cargos, salarios, áreas |
| **Clientes** | 250 | Empresas y personas naturales |
| **Productos** | 200 | 10 categorías diferentes |
| **Ventas** | 250 | Transacciones con relaciones |

---

## 🚀 Deploy en Vercel

### Opción 1: Deploy automático desde GitHub

1. Sube tu proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com) e importa tu repo
3. Vercel detectará automáticamente la configuración
4. ¡Listo! Tu API estará en `https://tu-proyecto.vercel.app/odata`

### Opción 2: Deploy con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### Configuración para Vercel

El proyecto incluye `vercel.json` preconfigurado:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/server.js"
    }
  ]
}

```

### Variables de entorno (opcional)

```bash
# .env
PORT=4000
NODE_ENV=production
```

---

## 🛠️ Desarrollo

### Agregar nuevas entidades

1. **Crear el archivo JSON**
```bash
# data/entities/MiNuevaEntidad.json
[
  { "id": 1, "nombre": "Item 1" },
  { "id": 2, "nombre": "Item 2" }
]
```

2. **Actualizar metadata.xml**
```xml
<EntityType Name="MiNuevaEntidad">
  <Key><PropertyRef Name="id"/></Key>
  <Property Name="id" Type="Edm.Int32" Nullable="false"/>
  <Property Name="nombre" Type="Edm.String"/>
</EntityType>

<EntityContainer Name="DefaultContainer">
  <EntitySet Name="MiNuevaEntidad" EntityType="Mock.Models.MiNuevaEntidad"/>
</EntityContainer>
```

3. **Actualizar odata.json**
```json
{
  "value": [
    { "name": "MiNuevaEntidad", "kind": "EntitySet", "url": "MiNuevaEntidad" }
  ]
}
```

4. **Agregar expansión en server.js** (si tiene relaciones)
```javascript
case "MiNuevaEntidad":
  entity = allEntities.MiNuevaEntidad.find(e => e.id === item.miNuevaEntidadId);
  break;
```

### Regenerar datos mock

```bash
# Editar generate-mock-data.js según necesites
node generate-mock-data.js
```

### Testing local

```bash
# Iniciar servidor
npm start

# Probar endpoints
curl http://localhost:4000/odata
curl http://localhost:4000/odata/\$metadata
curl "http://localhost:4000/odata/Ventas?\$count=true&\$top=5"
```

---

## 📚 Recursos y Referencias

- [OData v4 Specification](https://www.odata.org/documentation/)
- [OData Query Options](https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html)
- [Express.js Documentation](https://expressjs.com/)
- [Vercel Deployment Docs](https://vercel.com/docs)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Si encuentras un bug o tienes una mejora:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@hanercamilo](https://github.com/hanercamilo)
- LinkedIn: [hanercamilo](https://linkedin.com/in/hanercamilo)

---

## ⭐ Dale una estrella

Si este proyecto te fue útil, considera darle una ⭐ en GitHub!

---

<div align="center">

**[⬆ Volver arriba](#-odata-mock-server)**

Hecho con ❤️ para la comunidad de desarrolladores

</div>