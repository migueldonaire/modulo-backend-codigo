# 04 · NestJS: autenticación y autorización

Estado al terminar los apuntes `04_nestjs_autenticacion.md`: el proyecto de la 03b con registro y login (`argon2` + `@nestjs/jwt@11`), `AuthGuard` (401) y `EmployeeGuard` (403). Leer libros es público; crear, modificar y borrar es solo para empleados.

```bash
docker compose up -d   # PostgreSQL con las tablas books y users
npm install
cp .env.example .env
npm run start:dev      # http://localhost:3000/api/books
```

El `compose.yaml` levanta PostgreSQL 17 (contenedor `postgres-04`) y ejecuta `database/schema.sql` al crearse.

Si tienes encendido `postgres-sql` (u otro PostgreSQL), páralo antes: `docker stop postgres-sql`. Los dos usan el puerto 5432.

`schema.sql` solo se ejecuta la primera vez, con el volumen vacío. Para empezar de cero: `docker compose down -v` y otra vez `docker compose up -d`.

Para hacer empleado a un usuario:

```bash
docker compose exec postgres psql -U alumno -d bootcamp_api -c "UPDATE users SET role = 'employee' WHERE email = 'ana@mail.com';"
```

¿Prefieres el contenedor `postgres-sql` de la clase de SQL? Crea la base de datos con los mismos `docker exec` que en la 03b (si ya tenías la tabla `books` de la 03b, ejecuta solo el `CREATE TABLE users` del final de `schema.sql`) y cambia `docker compose exec postgres` por `docker exec -it postgres-sql` en el `UPDATE`.

No hace falta volver a hacer login: el token solo lleva el id. El `AuthGuard` solo comprueba el token; `/me` y el `EmployeeGuard` leen el usuario de la base de datos en cada petición.
