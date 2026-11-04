# 03b · NestJS + PostgreSQL: el patrón repositorio

Estado al terminar los apuntes `03b_nestjs_postgresql.md`: la API de la 03a con un puerto (`BooksRepository`, una `abstract class`) y dos adaptadores (`BooksRepositoryMemory` y `BooksRepositoryPostgres`, con `pg` y SQL a mano). Se cambia de uno a otro con una línea en `src/books/books.module.ts`.

```bash
npm install
cp .env.example .env
docker exec -i postgres-sql psql -U alumno -d academia -c "CREATE DATABASE bootcamp_api;"
docker exec -i postgres-sql psql -U alumno -d bootcamp_api < database/schema.sql
npm run start:dev
```

Necesita el contenedor `postgres-sql` de la clase de SQL. El `.env` se lee con `process.loadEnvFile()` (Node 20.12 o superior).
