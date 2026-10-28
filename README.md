# Código de los apuntes de backend

Proyectos terminados de los apuntes de backend (Express, MongoDB, NestJS y PostgreSQL). Cada carpeta es un proyecto independiente con su propio `package.json`.

| Carpeta | Apuntes | Qué contiene |
|---|---|---|
| `02-express-memoria` | `02_express_typescript.md` | API de productos con Express 5 + TypeScript. Datos en memoria, middlewares, CORS y router. |
| `02b-express-mongodb` | `02b_express_mongodb.md` | La misma API guardando los datos en MongoDB con el driver oficial (sin Mongoose). |
| `03-nestjs-postgresql` | `03_nestjs_postgresql.md` | CRUD de productos con NestJS 11 + PostgreSQL usando `pg` (sin ORM). Estado al terminar el apunte 03. |
| `04-nestjs-auth-testing-swagger` | `04a_autenticacion_jwt_roles.md` y `04b_testing_swagger.md` | El proyecto 03 con registro y login, JWT, argon2, roles, tests con Jest (unitarios e integración) y Swagger. |

Los proyectos 03 y 04 son el mismo proyecto en dos momentos. El 04 incluye también las soluciones de algunos ejercicios de testing (`products.service.spec.ts`, `roles.guard.spec.ts`, `test/auth.e2e-spec.ts` y el test extra de `auth.service.spec.ts`).

## Requisitos

- Node 24 LTS.
- Docker.
- Para 03 y 04: el contenedor de PostgreSQL de la clase de SQL (`postgres-sql`, usuario `alumno`).
- Para 02b: el contenedor de MongoDB de la clase de Mongo (`mongodb-practica`, usuario `admin`).

## Puesta en marcha rápida

En cada carpeta:

```bash
npm install
cp .env.example .env   # solo 02b, 03 y 04
```

Después sigue el `README.md` de esa carpeta.
