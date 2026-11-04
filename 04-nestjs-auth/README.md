# 04 · NestJS: autenticación y autorización

Estado al terminar los apuntes `04_nestjs_autenticacion.md`: el proyecto de la 03b con registro y login (`argon2` + `@nestjs/jwt@11`), `AuthGuard` (401) y `EmployeeGuard` (403). Leer libros es público; crear, modificar y borrar es solo para empleados.

```bash
npm install
cp .env.example .env
docker exec -i postgres-sql psql -U alumno -d academia -c "CREATE DATABASE bootcamp_api;"
docker exec -i postgres-sql psql -U alumno -d bootcamp_api < database/schema.sql
npm run start:dev
```

Si ya tenías la tabla `books` de la 03b, ejecuta solo el `CREATE TABLE users` del final de `schema.sql`.

Para hacer empleado a un usuario:

```bash
docker exec -it postgres-sql psql -U alumno -d bootcamp_api -c "UPDATE users SET role = 'employee' WHERE email = 'ana@mail.com';"
```

No hace falta volver a hacer login: el token solo lleva el id. El `AuthGuard` solo comprueba el token; `/me` y el `EmployeeGuard` leen el usuario de la base de datos en cada petición.
