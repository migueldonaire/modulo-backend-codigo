# 03a · NestJS: la API de libros en memoria

Estado al terminar los apuntes `03a_nestjs_fundamentos.md`: CRUD de libros (`id`, `title`, `author`, `pages`) con NestJS 11, datos en memoria, DTO con `class-validator`, `ParseIntPipe` y errores 400/404.

```bash
npm install
npm run start:dev
```

Prueba: `curl http://localhost:3000/api/books`

| Ruta | Qué hace |
|---|---|
| `GET /api/books?author=gabriel` | Lista (filtro opcional por autor) |
| `GET /api/books/:id` | Un libro, o 404 |
| `POST /api/books` | Crea (201), o 400 si el body no vale |
| `PATCH /api/books/:id` | Modifica los campos enviados (al menos uno) |
| `DELETE /api/books/:id` | Borra y devuelve el libro (200) |

Las soluciones de los ejercicios están dentro de los apuntes.
