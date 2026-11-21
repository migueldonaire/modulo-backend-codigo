# Imagen con Node.js 24
FROM node:24-alpine
WORKDIR /app
# Primero las dependencias (Docker las guarda en caché si no cambian)
COPY package*.json ./
RUN npm ci
# Después el código, y lo compilamos a JavaScript (carpeta dist/)
COPY . .
RUN npm run build
CMD ["node", "dist/main"]
