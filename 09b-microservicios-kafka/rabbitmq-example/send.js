import amqp from 'amqplib';

const connection = await amqp.connect('amqp://localhost'); // conectamos con RabbitMQ
const channel = await connection.createChannel(); // un "canal" para hablar

const queue = 'emails'; // el nombre de la cola
await channel.assertQueue(queue); // crea la cola si no existe

const text = process.argv[2] ?? 'Hola desde RabbitMQ'; // el texto que escribas
channel.sendToQueue(queue, Buffer.from(text)); // dejamos el mensaje en la cola
console.log(`Enviado: ${text}`);

await channel.close();
await connection.close();
