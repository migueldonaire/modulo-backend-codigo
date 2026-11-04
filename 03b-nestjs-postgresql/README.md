# 03b · NestJS + PostgreSQL

Estado al terminar los apuntes `03b_nestjs_postgresql.md`: la API de la 03a, con el servicio guardando los libros en PostgreSQL (`pg`, SQL a mano con `$1`, `$2`...). Incluye `toBook` (fila → libro de la API) y el contrato opcional `BooksContract`.

```bash
npm install
cp .env.example .env
docker exec -i postgres-sql psql -U alumno -d academia -c "CREATE DATABASE bootcamp_api;"
docker exec -i postgres-sql psql -U alumno -d bootcamp_api < database/schema.sql
npm run start:dev
```

Necesita el contenedor `postgres-sql` de la clase de SQL. El `.env` se lee con `process.loadEnvFile()` (Node 20.12 o superior).
