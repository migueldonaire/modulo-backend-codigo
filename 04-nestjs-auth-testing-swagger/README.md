# 04 · NestJS: autenticación, testing y Swagger

1. Crea las dos bases de datos (desarrollo y tests) y carga el esquema en ambas:

   ```bash
   docker exec -it postgres-sql psql -U alumno -d academia -c "CREATE DATABASE bootcamp_api;"
   docker exec -it postgres-sql psql -U alumno -d academia -c "CREATE DATABASE bootcamp_api_test;"
   docker exec -i postgres-sql psql -U alumno -d bootcamp_api < database/schema.sql
   docker exec -i postgres-sql psql -U alumno -d bootcamp_api_test < database/schema.sql
   ```

   Si ya tienes `bootcamp_api` del proyecto 03, carga solo la parte de `users` del esquema.

2. Copia `.env.example` a `.env` y `.env.test.example` a `.env.test`. Pon un `JWT_SECRET` propio:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Arranca y prueba:

   ```bash
   npm install
   npm run start:dev    # API en http://localhost:3000/api y Swagger en http://localhost:3000/docs
   npm test             # tests unitarios
   npm run test:e2e     # tests de integración (usan bootcamp_api_test y la vacían)
   ```

Para tener un administrador, regístrate y cambia el rol en la base de datos:

```sql
UPDATE users SET role = 'admin' WHERE email = 'tu@correo.com';
```

Después vuelve a hacer login: el rol va dentro del token.
