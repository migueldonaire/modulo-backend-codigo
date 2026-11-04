# 02b · Express + MongoDB (driver nativo)

Proyecto terminado del apunte `02b_express_mongodb.md`: la API del apunte 02 guardando los datos en MongoDB con el driver oficial (sin Mongoose), **con las soluciones de los ejercicios y retos**.

## Puesta en marcha

Necesitas Node.js 24 LTS y Docker.

1. Arranca MongoDB. Si ya tienes el contenedor `mongodb-practica` de la clase de Mongo, basta con `docker start mongodb-practica`. Si no:

   ```bash
   docker compose up -d
   ```

2. Crea el `.env` a partir del ejemplo (ya trae el usuario y la contraseña de clase):

   ```bash
   cp .env.example .env
   ```

3. Instala y mete los datos de prueba (3 productos y 2 categorías; borra lo que hubiera):

   ```bash
   npm install
   npm run seed
   ```

   Es lo mismo que el `insertMany` del apartado 1 del apunte, pero con categorías. El script está en `mongo/seed.js`.

4. Arranca la API:

   ```bash
   npm run dev         # http://localhost:3000/api/products
   npm run typecheck   # comprobar tipos
   npm run lint        # ESLint (lo mismo que pasa el CI)
   ```

   Tienes que ver `Conectado a MongoDB` y `Servidor escuchando en http://localhost:3000`.

Si sale `Authentication failed`, es que el volumen de datos ya existía sin contraseña. Bórralo con `docker compose down -v` y vuelve a arrancar.

## Estructura

```text
02b-express-mongodb/
├── .github/workflows/ci.yml   ← CI mínimo: htmlhint + lint + tipos
├── mongo/seed.js              ← datos de prueba (npm run seed)
├── src/
│   ├── routes/
│   │   ├── products.ts        ← CRUD de productos con MongoDB (apartado 4, ej. 7)
│   │   └── categories.ts      ← CRUD de categorías con índice único (reto 2)
│   ├── soluciones/            ← variantes que NO están montadas en la API
│   │   ├── ejercicio-08-patch-updateOne.ts
│   │   └── reto-1-products-id.ts
│   ├── db.ts                  ← conexión (apartado 3)
│   └── index.ts               ← middlewares, rutas y arranque
├── .env.example               ← copia a .env
├── compose.yaml               ← MongoDB 8 (contenedor mongodb-practica)
├── eslint.config.mjs
├── package.json
└── tsconfig.json
```

## Dónde está cada ejercicio

| Apunte | Dónde | Qué hay |
|---|---|---|
| Ejercicios 1-6 | — | Pruebas y preguntas: se resuelven en clase. |
| Ejercicio 7 | `src/routes/products.ts` | Campo `category` (validación, `POST`, `PATCH`) y `GET /api/products?category=muebles&search=tec` con `$regex` |
| Ejercicio 8 | `src/soluciones/ejercicio-08-patch-updateOne.ts` | `PATCH` con `updateOne` + `findOne`. Cómo montarlo, en el comentario de arriba del archivo. |
| Reto 1 | `src/soluciones/reto-1-products-id.ts` | Router de productos que responde `id` en vez de `_id` con `toApi()`. Para usarlo, cambia el import de `productsRouter` en `src/index.ts`. |
| Reto 2 | `src/routes/categories.ts` | CRUD de `/api/categories`. Nombre repetido → error `11000` → `409`. El índice único se crea al arrancar (`src/db.ts`) y en `mongo/seed.js`. |

Las variantes de `src/soluciones/` no están montadas porque cambian lo que devuelve la API (el reto 1 quita `_id`). `validateProduct`, `productsCollection` y el tipo `Product` se exportan desde `routes/products.ts` para poder reutilizarlos en ellas.

## Tabla de pruebas

Cambia `<ID>` por un `_id` real (cópialo de `GET /api/products`).

```bash
curl -i http://localhost:3000/api/products                          # 200, array
curl -i "http://localhost:3000/api/products?category=muebles"       # 200, solo muebles
curl -i "http://localhost:3000/api/products?search=TEC"             # 200, el teclado
curl -i http://localhost:3000/api/products/<ID>                     # 200
curl -i http://localhost:3000/api/products/abc                      # 400: formato incorrecto
curl -i http://localhost:3000/api/products/66f000000000000000000000 # 404: no existe
curl -i -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"name":"Monitor","price":149.99}'   # 201
curl -i -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"price":1}'                       # 400
curl -i -X PATCH http://localhost:3000/api/products/<ID> -H "Content-Type: application/json" -d '{"price":34.5}'              # 200
curl -i -X PATCH http://localhost:3000/api/products/<ID> -H "Content-Type: application/json" -d '{}'                          # 400
curl -i -X DELETE http://localhost:3000/api/products/<ID>                                                                    # 204

curl -i -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d '{"name":"cocina"}'   # 201
curl -i -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -d '{"name":"cocina"}'   # 409
```

Con MongoDB parado (`docker compose stop`), cualquier petición tarda unos 30 segundos y responde `500`: lo responde el middleware de errores (apartado 5 del apunte).
