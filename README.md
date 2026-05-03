# SIATA - Sistema de Gestión de Envíos

## 1. Descripción General

Sistema fullstack para la gestión de envíos (terrestres y marítimos), construido con una arquitectura desacoplada entre frontend y backend.

- Backend: NestJS + REST + Prisma
- Frontend: React + Vite + React Query
- Base de datos: PostgreSQL
- Orquestación: Docker

---

## 2. Tecnologías Utilizadas

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

## 3. Diagrama E-R (Descripción)

Entidades principales:

- client (1) --- (N) shipment
- shipment (1) --- (N) shipment_item
- shipment_item (N) --- (1) product
- shipment (1) --- (1) land_shipment
- shipment (1) --- (1) sea_shipment
- land_shipment (N) --- (1) warehouse
- sea_shipment (N) --- (1) port

---

## 4. Script de Base de Datos

Se utiliza Prisma para la generación del esquema.

Ejemplo UUID:

- Se usa @default(uuid()) desde Prisma
- No se usa uuid-ossp

---

## 5. API

Documentación disponible en:

http://localhost:3000/api/docs

Tipo: REST

---

## 6. Reglas de Negocio

Los envíos solo permiten actualizar:

- delivery_date
- items
- vehiclePlate
- fleetNumber
- warehouse
- port

---

## 7. Artefactos de Despliegue

Se incluyen:

- Dockerfile (backend)
- Dockerfile (frontend)
- docker-compose.yml

Ejecución:

```bash
docker compose up --build
```

---

## 8. Buenas Prácticas Aplicadas

- Separación por capas (controller, service, repository)
- DTOs para validación
- Uso de interfaces tipadas en frontend
- Manejo de estado con React Query
- Reutilización de componentes
- Normalización de base de datos
- Uso de UUID como identificador externo
- Evitar lógica en controladores

---

## 9. Justificación Tecnológica

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

## 10. Notas y Mejoras

- No se implementaron estados en envíos
- No se implementaron filtros avanzados (solo paginación)
- Eliminación física por simplicidad
- Se puede implementar soft delete
- Se pueden agregar logs
- Mejoras en responsive pendientes
- Posible implementación de inventario

---

## 11. URL del Repositorio

https://github.com/mcartage32/SIATA-test.git

---

## 12. Conclusión

El sistema cumple con los requisitos planteados, implementando buenas prácticas, separación de responsabilidades y una arquitectura escalable lista para evolución futura.
