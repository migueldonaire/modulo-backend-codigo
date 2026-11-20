# 09a. Microservicios con NestJS por TCP

Código terminado de los apuntes `09a_microservicios_nestjs_tcp.md`: la tienda de libros partida en tres proyectos NestJS que hablan por TCP. Los datos están en memoria.

| Carpeta | Puerto | Qué hace |
|---|---|---|
| `gateway` | 3000 (HTTP) | La puerta de entrada: rutas `/api/books` y `/api/orders`, valida con DTO y traduce los errores a códigos HTTP (`callService`). |
| `books-service` | 3001 (TCP) | Los libros: mensajes `get_books`, `get_book` y `create_book`. |
| `orders-service` | 3002 (TCP) | Los pedidos: `get_orders` y `create_order`. Pregunta a `books-service` el precio y el stock. |

## Arrancar

En **tres terminales**, una por carpeta:

```bash
npm install
npm run start:dev
```

Empieza por `books-service`, luego `orders-service` y por último `gateway`.

## Probar

```bash
curl http://localhost:3000/api/books
curl http://localhost:3000/api/books/2
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"bookId":1,"quantity":2}'
curl http://localhost:3000/api/orders
```

Para `books-service` con `Ctrl + C` y repite: el gateway responde `503` y sigue vivo.
