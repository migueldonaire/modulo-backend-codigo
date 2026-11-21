import amqp from 'amqplib';

const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

const queue = 'emails';
await channel.assertQueue(queue);

console.log('Esperando mensajes. Ctrl + C para salir');

// Cada mensaje que llega a la cola se procesa aquí
channel.consume(queue, (message) => {
  console.log(`Recibido: ${message.content.toString()}`);
  channel.ack(message); // "ya está": RabbitMQ lo BORRA de la cola
});
