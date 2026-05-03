# SIATA - Sistema de Gestión de Envíos

## 1. Descripción General

Sistema fullstack para la gestión de envíos (terrestres y marítimos), construido con una arquitectura desacoplada entre frontend y backend.

- Backend: NestJS + REST + Prisma
- Frontend: React + Vite + React Query
- Base de datos: PostgreSQL
- Orquestación: Docker

---

## 2. Estructura del proyecto

```text
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── auth/
│   │   ├── client/
│   │   ├── common/
│   │   │   ├── constants/
│   │   │   ├── dtos/
│   │   │   ├── errors/
│   │   │   ├── utils/
│   │   │   └── validators/
│   │   ├── generated/
│   │   ├── interfaces/
│   │   ├── port/         # Esta misma estructura se repite en los demas modulos
│   │   │   ├── constants/
│   │   │   ├── dtos/
│   │   │   ├── port.controller.ts
│   │   │   ├── port.module.ts
│   │   │   └── port.service.ts
│   │   ├── prisma/
│   │   ├── product/
│   │   ├── shipment/
│   │   ├── warehouse/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── .env.example
│   ├── .prettierrc
│   ├── bun.lock
│   ├── dockerfile
│   ├── eslint.config.mjs
│   ├── nest-cli.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── reactQuery/
│   │   │   ├── axiosConfig.ts
│   │   │   └── endpoints.ts
│   │   ├── components/
│   │   ├── constants/
│   │   ├── containers/
│   │   │   ├── layout/
│   │   │   └── pages/
│   │   │       ├── auth/
│   │   │       ├── clients/              # Estos mismos archivos o estructura se repite en los demas modulos (ports, products,etc)
│   │   │       │   ├── ClientColumns.tsx
│   │   │       │   ├── CreateClientModal.tsx
│   │   │       │   ├── EditClientModal.tsx
│   │   │       │   └── index.tsx
│   │   │       ├── ports/
│   │   │       ├── products/
│   │   │       ├── shipments/
│   │   │       └── warehouses/
│   │   ├── hooks/
│   │   ├── interfaces/
│   │   ├── router/
│   │   ├── main.css
│   │   └── main.tsx
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── bun.lock
│   ├── dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 3. Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js 20+
- PostgreSQL
- Bun o npm

> **Nota:** El proyecto esta configurado para correr en los puertos determinados: postgres en 5432, NestJs en 300 y React en 5173

---

## 4. Tecnologías Utilizadas

### Backend

- NestJS
- Prisma ORM
- PostgreSQL
- Swagger (documentación API)
- class-validator / class-transformer
- JWT (estructura preparada)

### Frontend

- React + Vite
- React Query
- Axios
- Ant Design
- TailwindCSS
- Zustand

---

## 5. Variables de Entorno

### Backend

```env
DATABASE_URL="postgresql://root:root@localhost:5432/postgres"
PORT=3000
JWT_SECRET=clave_para_prueba_SIATA
```

### Frontend

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 6. Instalación y Ejecución

### 6.1 Instalación y ejecución con Docker

> **Nota:** Luego de clonar el repositorio, se debe crear los respectivos archivos .env en las carpetas backend y frontend, con los respectivos valores.

Desde la raíz del proyecto, ejecuta el siguiente comando para levantar la base de datos, el backend y el frontend automáticamente:

```bash
docker compose up --build
```

### 6.2 Backend

1. Ir al directorio:

```bash
cd backend
```

2. Instalar dependencias:

```bash
bun install
```

o

```bash
npm install
```

3. Crea el archivo .env

```env
DATABASE_URL="postgresql://root:root@localhost:5432/postgres"
PORT=3000
JWT_SECRET=clave_para_prueba_SIATA
```

4. Generar cliente de Prisma:

```bash
bunx prisma generate
```

5. Ejecutar migraciones:

```bash
bunx prisma migrate dev
```

6. (Recomendación) Ejecutar seed:

```bash
bunx prisma db seed
```

7. Iniciar servidor:

```bash
bun run start:dev
```

El backend correrá en:

```
http://localhost:3000/graphql
```

---

### 6.3 Frontend

1. Ir al directorio:

```bash
cd frontend
```

2. Instalar dependencias:

```bash
bun install
```

o

```bash
npm install
```

3. Crear archivo .env

```env
VITE_API_URL=http://localhost:3000/graphql
```

4. Ejecutar proyecto:

```bash
bun dev
```

El frontend correrá en:

```
http://localhost:5173
```

---

## 7. Diagrama E-R (Descripción)

- client (1) --- (N) shipment
- shipment (1) --- (N) shipment_item
- shipment_item (N) --- (1) product
- shipment (1) --- (1) land_shipment
- shipment (1) --- (1) sea_shipment
- land_shipment (N) --- (1) warehouse
- sea_shipment (N) --- (1) port

---

## 8. Script de Base de Datos

Se utiliza Prisma para la generación del esquema.

Ejemplo UUID:

- Se usa @default(uuid()) desde Prisma
- No se usa uuid-ossp

---

## 9. API RESTFUL

Documentación disponible en:

http://localhost:3000/api/docs

---

## 10. Reglas de Negocio

Los envíos solo permiten actualizar:

- delivery_date
- items
- vehiclePlate
- fleetNumber
- warehouse
- port

---

## 11. Artefactos de Despliegue

Se incluyen:

- Dockerfile (backend)
- Dockerfile (frontend)
- docker-compose.yml

Ejecución:

```bash
docker compose up --build
```

---

## 12. Buenas Prácticas Aplicadas

- Separación por capas (controller, service, repository)
- DTOs para validación
- Uso de interfaces tipadas en frontend
- Manejo de estado con React Query
- Reutilización de componentes
- Normalización de base de datos
- Uso de UUID como identificador externo
- Evitar lógica en controladores

---

## 13. Justificación Tecnológica

### NestJS

- Arquitectura escalable
- Modularidad
- Buen soporte para REST

### Prisma

- Tipado fuerte
- Migraciones controladas
- Integración sencilla con PostgreSQL

### React + React Query

- Manejo eficiente de estado remoto
- Separación clara de lógica y UI

### PostgreSQL

- Base de datos robusta
- Soporte para relaciones complejas

---

## 14. Notas y Mejoras

- No se implementaron estados en envíos
- No se implementaron filtros avanzados (solo paginación)
- Eliminación física por simplicidad
- Se puede implementar soft delete
- Se pueden agregar logs
- Mejoras en responsive
- Posible implementación de inventario
- No se desplego en algun servidor publico por cuestiones de tiempo.

---

## 15. URL del Repositorio

https://github.com/mcartage32/SIATA-test.git

---

## 16. Conclusión

El sistema cumple con los requisitos planteados, implementando buenas prácticas, separación de responsabilidades y una arquitectura escalable lista para evolución futura.
