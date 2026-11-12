# 07 · NestJS: una API para el mundo real

Estado al terminar los apuntes `07_nestjs_api_mundo_real.md`. Es la API de libros de la 03b con:

- **Versiones** en la URL: `/api/v1/...` y `/api/v2/...` (`enableVersioning` + `@Version('2')`).
- **Paginación y orden** en `GET /api/v2/books?page=2&limit=5&sort=title&order=desc` (DTO `ListBooksQueryDto`).
- **Seguridad básica**: `helmet` (cabeceras) y `@nestjs/throttler` (límite de peticiones, `429`).
- **Pedidos** con **relaciones** (`orders` → `order_items` → `books`, con `JOIN`) y una **transacción** (`BEGIN` / `COMMIT` / `ROLLBACK`) que resta el stock.
- **Errores con la misma forma** (`AllExceptionsFilter`) y **logs** con el `Logger` de NestJS.

```bash
npm install
cp .env.example .env
docker exec -i postgres-sql psql -U alumno -d academia -c "CREATE DATABASE bootcamp_api;"   # si no la tienes de la 03b
docker exec -i postgres-sql psql -U alumno -d bootcamp_api < database/schema.sql
npm run start:dev
```

Ojo: `database/schema.sql` **borra** las tablas `books`, `orders` y `order_items` y las crea de nuevo con 12 libros.

## Rutas

| Petición | Qué hace |
|---|---|
| `GET /api/v1/books?author=márquez` | Todos los libros (un array), como en la 03b. |
| `GET /api/v2/books?page=1&limit=10&sort=id&order=asc&author=` | Una página: `{ data, total, page, limit, totalPages }`. |
| `GET /api/v1/books/:id`, `POST`, `PATCH`, `DELETE` | Igual que en la 03b (ahora con `stock`). |
| `POST /api/v1/orders` | Crea un pedido `{ "items": [{ "bookId": 1, "quantity": 2 }] }`. `409` si falta stock (y no se guarda nada). Máximo 3 por minuto. |
| `GET /api/v1/orders/:id` | El pedido con sus líneas. |
