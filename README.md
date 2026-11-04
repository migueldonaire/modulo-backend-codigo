# Código de los apuntes de backend

Los proyectos terminados de los apuntes de backend: Express, MongoDB, NestJS y PostgreSQL. Cada carpeta es un proyecto independiente, con su propio `package.json` y su `README.md`.

## Los proyectos

Son dos APIs, cada una en varios momentos. Cada carpeta es el estado al terminar esa clase.

### API de productos con Express

| Carpeta | Apuntes | Qué hay |
|---|---|---|
| `02-express-memoria` | `02_express_typescript.md` | Express 5 + TypeScript con los datos en memoria: CRUD, middlewares, errores en JSON, CORS, `Router` y la página web con `fetch`. |
| `02b-express-mongodb` | `02b_express_mongodb.md` | La misma API guardando los productos en MongoDB con el driver oficial (sin Mongoose). Trae `compose.yaml` y `npm run seed`. |

Estas dos carpetas incluyen las soluciones de los ejercicios y retos. Su `README.md` tiene una tabla que dice en qué archivo está cada una.

### API de libros con NestJS

| Carpeta | Apuntes | Qué hay |
|---|---|---|
| `03a-nestjs-memoria` | `03a_nestjs_fundamentos.md` | NestJS 11 con los libros en memoria: controlador, servicio, módulo, DTO, pipes y errores `400`/`404`. |
| `03b-nestjs-postgresql` | `03b_nestjs_postgresql.md` | La 03a con el servicio contra PostgreSQL (`pg`, SQL a mano, sin ORM). |
| `04-nestjs-auth` | `04_nestjs_autenticacion.md` | La 03b con registro, login (argon2 + JWT), `AuthGuard` y `EmployeeGuard`: los clientes leen y los empleados editan. |
| `05-nestjs-testing-swagger` | `05_nestjs_testing_swagger.md` | La 04 con tests de Jest (unitarios y de integración) y Swagger. |

## Requisitos

- Node.js 24 LTS.
- Docker.
- Para `02b`: el contenedor de MongoDB de la clase de Mongo (`mongodb-practica`, usuario `admin`), o el `compose.yaml` de la carpeta.
- Para `03b`, `04` y `05`: el contenedor de PostgreSQL de la clase de SQL (`postgres-sql`, usuario `alumno`).

## Puesta en marcha

Entra en la carpeta que quieras y:

```bash
npm install
cp .env.example .env   # en 02b, 03b, 04 y 05
```

Después sigue el `README.md` de esa carpeta.

## CI

`02-express-memoria` y `02b-express-mongodb` llevan ESLint y su propio `.github/workflows/ci.yml` (el CI mínimo: htmlhint, lint y tipos). GitHub solo ejecuta los workflows de la raíz del repositorio, así que ese archivo funciona cuando copias la carpeta como repositorio independiente. Dentro de este repositorio, el `.github/workflows/ci.yml` de la raíz pasa lint y tipos de las dos carpetas.

Usan TypeScript 6 (`typescript@~6.0`), porque `typescript-eslint` todavía no funciona con TypeScript 7.
