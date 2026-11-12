# 08 · NestJS: ficheros, caché, colas, WebSockets, GraphQL y HATEOAS

Estado al terminar los apuntes `08_nestjs_extras.md`. Es la API de la 07 con:

- **Subida de portadas** (`POST /api/v1/books/:id/cover`, campo `cover`): a la carpeta `uploads/` del servidor, o a **Supabase Storage** (`POST /api/v1/books/:id/cover-supabase`). PNG, JPG o WEBP, máximo 2 MB.
- **Caché con Redis** en `GET /api/v1/books/:id` (60 segundos), que se borra al modificar el libro.
- **Cola de tareas** con BullMQ: al crear un pedido, el "correo" se envía en segundo plano.
- **WebSockets** con Socket.IO: aviso en directo de libros nuevos y un chat. Página de prueba en `http://localhost:3000/`.
- **GraphQL** en `http://localhost:3000/graphql` (consultas `books`, `book` y mutación `createBook`).
- **HATEOAS**: `GET /api/v2/books` devuelve `links` (`self`, `first`, `last`, `prev`, `next`).

```bash
npm install
cp .env.example .env
docker exec -i postgres-sql psql -U alumno -d bootcamp_api < database/schema.sql
docker run -d --name redis-practica -p 6379:6379 redis:8    # solo la primera vez
npm run start:dev
```

Necesita PostgreSQL (`postgres-sql`) y Redis (`redis-practica`). Sin Redis la API no arranca. Para subir a Supabase, rellena `SUPABASE_URL` y `SUPABASE_SECRET_KEY` en el `.env` y crea un bucket **público** llamado `covers`.

Ojo: `database/schema.sql` **borra** las tablas y las crea otra vez.
