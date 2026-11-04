# 02 · Express + TypeScript (en memoria)

Proyecto terminado del apunte `02_express_typescript.md`: el código de la sesión **y las soluciones de todos los ejercicios y retos**. Los datos viven en memoria: se pierden al reiniciar el servidor.

## Puesta en marcha

Necesitas Node.js 24 LTS.

```bash
npm install
npm run dev         # http://localhost:3000/api/products
npm run typecheck   # tsx no comprueba tipos; esto sí
npm run lint        # ESLint (lo mismo que pasa el CI)
```

La página web del apartado 7 está en `web/index.html`. Ábrela con Live Server: tiene que abrirse en `http://127.0.0.1:5500` (con `localhost` falla el CORS, ejercicio 9).

## Estructura

```text
02-express-memoria/
├── .github/workflows/ci.yml   ← CI mínimo: htmlhint + lint + tipos
├── src/
│   ├── routes/
│   │   ├── products.ts        ← CRUD de productos (apartados 4 y 8, ej. 11-14, reto 1)
│   │   └── categories.ts      ← CRUD de categorías (reto 2)
│   └── index.ts               ← middlewares, rutas sueltas y arranque
├── web/index.html             ← página con fetch y formulario (apartado 7 y ej. 9)
├── eslint.config.mjs
├── package.json
└── tsconfig.json
```

## Dónde está cada ejercicio

| Apunte | Dónde | Qué hay |
|---|---|---|
| Ejercicio 1 | `src/index.ts` | `GET /api/health` |
| Ejercicio 2 | `src/index.ts` | `GET /api/hello?name=Ana&lang=en` |
| Ejercicios 3-8 y 10 | — | Pruebas de "rómpelo a propósito" y la tabla de pruebas: se resuelven en clase. La ruta `/api/boom` del ejercicio 8 está comentada en `src/index.ts`. |
| Ejercicio 9 | `web/index.html` | Lista de productos + formulario que crea con `POST` |
| Ejercicio 11 | `src/routes/products.ts` | `validateProduct(body, partial)` |
| Ejercicio 12 | `src/routes/products.ts` | Campo `category` (por defecto `"sin-categoria"`) |
| Ejercicio 13 | `src/routes/products.ts` | `GET /api/products?category=muebles&search=rat` |
| Ejercicio 14 | `src/routes/products.ts` | `PUT /api/products/:id` (sustituye el producto entero) |
| Reto 1 | `src/routes/products.ts` | `GET /api/products?page=2&limit=2` |
| Reto 2 | `src/routes/categories.ts` | CRUD de `/api/categories` con `409` si el nombre se repite |
| Reto 3 | `src/index.ts` | `GET /api/weather` (Open-Meteo, `502` si falla) |

Cambios respecto al código del apunte, para que todo funcione junto:

- CORS permite también `PUT` (lo necesita el ejercicio 14 si lo llamas desde la web).
- Con la paginación del reto 1, `GET /api/products` devuelve como mucho 10 productos si no pasas `limit`.

## Tabla de pruebas

```bash
# Productos
curl -i http://localhost:3000/api/products                       # 200, array
curl -i "http://localhost:3000/api/products?category=muebles"    # 200, solo la silla
curl -i "http://localhost:3000/api/products?search=RAT"          # 200, el ratón
curl -i "http://localhost:3000/api/products?page=2&limit=2"      # 200, el tercer producto
curl -i "http://localhost:3000/api/products?page=0"              # 400
curl -i http://localhost:3000/api/products/1                     # 200
curl -i http://localhost:3000/api/products/999                   # 404
curl -i http://localhost:3000/api/products/abc                   # 400
curl -i -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"name":"Monitor","price":149.99}'   # 201
curl -i -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"price":1}'                       # 400
curl -i -X PATCH http://localhost:3000/api/products/1 -H "Content-Type: application/json" -d '{}'                             # 400
curl -i -X PUT http://localhost:3000/api/products/1 -H "Content-Type: application/json" -d '{"name":"Teclado"}'               # 400: falta price
curl -i -X DELETE http://localhost:3000/api/products/2                                                                        # 204

# Categorías
curl -i -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d '{"name":"cocina"}'    # 201
curl -i -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d '{"name":"Muebles"}'   # 409: ya existe
curl -i http://localhost:3000/api/categories/9                                                                    # 404
```

> En Windows con PowerShell, las comillas de `-d` dan problemas. Usa Git Bash o Postman.
