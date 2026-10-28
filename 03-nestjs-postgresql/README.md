# 03 · NestJS 11 + PostgreSQL

1. Con el contenedor `postgres-sql` arrancado, crea la base de datos y carga el esquema:

   ```bash
   docker exec -it postgres-sql psql -U alumno -d academia -c "CREATE DATABASE bootcamp_api;"
   docker exec -i postgres-sql psql -U alumno -d bootcamp_api < database/schema.sql
   ```

   En PowerShell: `Get-Content database/schema.sql | docker exec -i postgres-sql psql -U alumno -d bootcamp_api`

2. Crea el `.env` a partir de `.env.example`.
3. Arranca:

   ```bash
   npm install
   npm run start:dev   # http://localhost:3000/api/products
   npm test            # tests unitarios
   ```
