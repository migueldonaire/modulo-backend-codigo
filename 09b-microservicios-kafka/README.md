# 09b. Microservicios con NestJS y Kafka

Código terminado de los apuntes `09b_microservicios_kafka.md`. Es la 09a con eventos: al crear un pedido, `orders-service` publica `order-created` en Kafka, y lo escuchan `books-service` (baja el stock) y `notifications-service` (escribe el email en la terminal).

| Carpeta | Habla por | Qué hace |
|---|---|---|
| `gateway` | HTTP 3000 | Igual que en la 09a. |
| `books-service` | TCP 3001 + Kafka | Híbrido: responde por TCP y escucha `order-created` (grupo `books`). |
| `orders-service` | TCP 3002 → Kafka | Crea el pedido y publica `order-created`. |
| `notifications-service` | Kafka | Escucha `order-created` (grupo `notifications`). |
| `rabbitmq-example` | RabbitMQ | Ejemplo aparte para comparar: `send.js` y `receive.js` con una cola. |

`compose.yaml` trae Kafka 4 (modo KRaft, sin Zookeeper), el panel `kafka-ui`, `kafka-init` (crea el topic con 3 particiones) y los cuatro servicios.

## Todo con Docker

```bash
docker compose up -d --build
docker compose logs -f notifications-service books-service
```

En otra terminal:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"bookId":1,"quantity":2}'
```

- Panel de Kafka: http://localhost:8080
- Dos copias de notificaciones: `docker compose up -d --scale notifications-service=2`

## Solo Kafka en Docker y los servicios en tu ordenador

```bash
docker compose up -d kafka kafka-ui
docker exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 \
  --create --topic order-created --partitions 3
```

Y en cada carpeta, en su propia terminal: `npm install` y `npm run start:dev`.

## RabbitMQ

```bash
cd rabbitmq-example
docker compose up -d
npm install
node send.js "Pedido 1"
node receive.js
```

Panel: http://localhost:15672 (`guest` / `guest`).
