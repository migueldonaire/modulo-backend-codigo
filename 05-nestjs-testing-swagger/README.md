# 05 · NestJS: tests y Swagger

Estado al terminar los apuntes `05_nestjs_testing_swagger.md`: el proyecto de la 04 con tests de Jest y documentación con Swagger.

```bash
docker compose up -d   # PostgreSQL con las tablas books y users
npm install
cp .env.example .env
npm run start:dev      # documentación en http://localhost:3000/docs
npm test               # tests unitarios: toBook, BooksService (Pool falso) y EmployeeGuard
npm run test:e2e       # tests de integración (necesita PostgreSQL con schema.sql)
```

El `compose.yaml` levanta PostgreSQL 17 (contenedor `postgres-05`) y ejecuta `database/schema.sql` al crearse. Es el mismo esquema que la 04.

Si tienes encendido `postgres-sql` (u otro PostgreSQL), páralo antes: `docker stop postgres-sql`. Los dos usan el puerto 5432.

`schema.sql` solo se ejecuta la primera vez, con el volumen vacío. Para empezar de cero: `docker compose down -v` y otra vez `docker compose up -d`.

Para hacer empleado a un usuario: `docker compose exec postgres psql -U alumno -d bootcamp_api -c "UPDATE users SET role = 'employee' WHERE email = 'ana@mail.com';"`
