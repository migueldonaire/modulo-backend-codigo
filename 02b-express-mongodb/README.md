# 02b · Express + MongoDB (driver nativo)

1. Arranca MongoDB. Si ya tienes el contenedor `mongodb-practica` de la clase de Mongo, basta con `docker start mongodb-practica`. Si no, `docker compose up -d` con el `compose.yaml` de esta carpeta.
2. Crea el `.env` a partir de `.env.example`.
3. Mete datos de prueba:

   ```bash
   docker exec -it mongodb-practica mongosh -u admin -p admin_dev_123 --authenticationDatabase admin bootcamp_api
   ```

   ```js
   db.products.insertMany([{ name: "Teclado", price: 29.99 }, { name: "Ratón", price: 15 }])
   ```

4. Arranca la API:

   ```bash
   npm install
   npm run dev
   ```

Si sale `Authentication failed`, es que el volumen de datos ya existía sin contraseña. Bórralo con `docker compose down -v` y vuelve a arrancar.
