# Código de los apuntes de backend

Proyectos terminados de los apuntes de backend (Express, MongoDB, NestJS y PostgreSQL). Cada carpeta es un proyecto independiente con su propio `package.json`.

| Carpeta | Apuntes | Qué contiene |
|---|---|---|
| `02-express-memoria` | `02_express_typescript.md` | API de productos con Express 5 + TypeScript. Datos en memoria, middlewares, CORS y router. Incluye las soluciones de todos los ejercicios y retos (filtros, búsqueda, paginación, CRUD de categorías, `PUT`, Open-Meteo) y la página web con `fetch`. |
| `02b-express-mongodb` | `02b_express_mongodb.md` | La misma API guardando los datos en MongoDB con el driver oficial (sin Mongoose). Incluye las soluciones de los ejercicios y retos, `npm run seed` con datos de prueba y `compose.yaml`. |
| `02c-express-capas` | `02c_arquitectura_mvc_capas.md` | La API del 02 en capas (rutas, controlador, servicio, modelo, DTO). Solución del reto. |
| `03a-nestjs-memoria` | `03a_nestjs_fundamentos.md` | API de libros con NestJS 11 en memoria: controlador, servicio, módulo, DTO y errores 400/404. |
| `03b-nestjs-postgresql` | `03b_nestjs_postgresql.md` | La misma API con el servicio contra PostgreSQL (`pg`, SQL a mano, sin ORM). |
| `04-nestjs-auth` | `04_nestjs_autenticacion.md` | La 03b con registro, login, JWT, `AuthGuard` y `EmployeeGuard` (clientes leen, empleados editan). |
| `05-nestjs-testing-swagger` | `05_nestjs_testing_swagger.md` | La 04 con tests de Jest (unitarios e integración) y Swagger. |
| `03-nestjs-postgresql` | `03_nestjs_postgresql.md` (versión anterior) | CRUD de productos con NestJS 11 + PostgreSQL usando `pg` (sin ORM). Estado al terminar el apunte 03. |
| `04-nestjs-auth-testing-swagger` | `04a_autenticacion_jwt_roles.md` y `04b_testing_swagger.md` (versión anterior) | El proyecto 03 con registro y login, JWT, refresh tokens, argon2, roles, tests con Jest (unitarios e integración) y Swagger. |

Los proyectos 03a, 03b, 04-nestjs-auth y 05-nestjs-testing-swagger son la misma API de libros en cuatro momentos (los apuntes nuevos, sesiones de 3 horas). Los proyectos 03 y 04-nestjs-auth-testing-swagger son el mismo proyecto en dos momentos. El 04 incluye también las soluciones de algunos ejercicios de testing (`products.service.spec.ts`, `roles.guard.spec.ts`, `test/auth.e2e-spec.ts` y el test extra de `auth.service.spec.ts`).

## Frontend (React)

En `react-academia/` está la app Academia de los apuntes de React, una carpeta por sesión (01 a 05). Mira su `README.md`.

## Requisitos

- Node 24 LTS.
- Docker.
- Para 03b, 03, 04 y 05: el contenedor de PostgreSQL de la clase de SQL (`postgres-sql`, usuario `alumno`).
- Para 02b: el contenedor de MongoDB de la clase de Mongo (`mongodb-practica`, usuario `admin`).

## Puesta en marcha rápida

En cada carpeta:

```bash
npm install
cp .env.example .env   # solo 02b, 03b, 03, 04 y 05
```

Después sigue el `README.md` de esa carpeta. En el de 02 y 02b hay una tabla que dice en qué archivo está la solución de cada ejercicio.

## CI

`02-express-memoria` y `02b-express-mongodb` llevan ESLint y su propio `.github/workflows/ci.yml` (el CI mínimo: htmlhint + lint + tipos). GitHub solo ejecuta los workflows de la raíz del repositorio, así que ese fichero funciona cuando copias la carpeta como repositorio independiente. Dentro de este repositorio, el `.github/workflows/ci.yml` de la raíz pasa lint y tipos de las dos carpetas.

Usan TypeScript 6 (`typescript@~6.0`): `typescript-eslint` todavía no funciona con TypeScript 7.
