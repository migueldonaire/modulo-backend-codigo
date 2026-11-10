# 03b · NestJS + PostgreSQL

Estado al terminar los apuntes `03b_nestjs_postgresql.md`: la API de la 03a, con el servicio guardando los libros en PostgreSQL (`pg`, SQL a mano con `$1`, `$2`...). Incluye `toBook` (fila → libro de la API) y el contrato opcional `BooksContract`.

```bash
npm install
cp .env.example .env
docker exec -i postgres-sql psql -U alumno -d academia -c "CREATE DATABASE bootcamp_api;"
docker exec -i postgres-sql psql -U alumno -d bootcamp_api < database/schema.sql
npm run start:dev
```

Necesita el contenedor `postgres-sql` de la clase de SQL. El `.env` se lee con `process.loadEnvFile()` (Node 20.12 o superior), solo si existe: en Render no hay `.env` y las variables las pone Render.

## Desplegar en Render

Paso a paso en los apuntes `06_despliegue_render.md`. Resumen:

| Campo de Render | Valor |
|---|---|
| Root Directory | `03b-nestjs-postgresql` (si el proyecto está en una subcarpeta) |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start:prod` |
| Variables | `DATABASE_URL` (la del *Session pooler* de Supabase, terminada en `?sslmode=no-verify`) |

Para `04` y `05`, lo mismo con su carpeta y una variable más: `JWT_SECRET`.
