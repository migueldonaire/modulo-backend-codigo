import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Book } from '../books/book';

// Un "gateway" es como un controlador, pero para WebSockets.
// Usa el mismo puerto que la API (3000).
@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer() // NestJS nos da el servidor de Socket.IO
  server: Server;

  // El servidor avisa a TODOS los conectados de que hay un libro nuevo
  bookCreated(book: Book) {
    this.server.emit('book-created', book);
  }

  // Cuando un cliente envía un mensaje 'chat'...
  @SubscribeMessage('chat')
  handleChat(@MessageBody() text: string) {
    // ...se lo reenviamos a todos
    this.server.emit('chat', text);
  }
}
