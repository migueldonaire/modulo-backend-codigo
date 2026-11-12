import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderRow, toOrder } from './order';

@Injectable()
export class OrdersService {
  // Un logger con el nombre de la clase: en la consola sale [OrdersService]
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly pool: Pool) {}

  async findOne(id: number): Promise<Order> {
    // JOIN: el pedido + sus líneas + el título de cada libro
    const result = await this.pool.query<OrderRow>(
      `SELECT o.id, o.created_at, i.book_id, b.title, i.quantity
       FROM orders o
       JOIN order_items i ON i.order_id = o.id
       JOIN books b ON b.id = i.book_id
       WHERE o.id = $1
       ORDER BY i.id`,
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Pedido no encontrado');
    }
    return toOrder(result.rows); // varias filas → un pedido
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    // Una transacción tiene que ir SIEMPRE por la misma conexión:
    // pedimos una al Pool y la usamos para todo.
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN'); // empieza la transacción

      const order = await client.query<{ id: number }>(
        'INSERT INTO orders DEFAULT VALUES RETURNING id',
      );
      const orderId = order.rows[0].id;

      for (const item of dto.items) {
        // Resta el stock solo si hay suficiente
        const updated = await client.query(
          `UPDATE books SET stock = stock - $1
           WHERE id = $2 AND stock >= $1`,
          [item.quantity, item.bookId],
        );
        if (updated.rowCount === 0) {
          // El libro no existe o no hay ejemplares: se cancela TODO
          throw new ConflictException(
            `Libro ${item.bookId}: no existe o no hay stock suficiente`,
          );
        }

        await client.query(
          `INSERT INTO order_items (order_id, book_id, quantity)
           VALUES ($1, $2, $3)`,
          [orderId, item.bookId, item.quantity],
        );
      }

      await client.query('COMMIT'); // todo ha ido bien: se guarda
      this.logger.log(`Pedido ${orderId} creado`);
      return this.findOne(orderId);
    } catch (error) {
      await client.query('ROLLBACK'); // algo ha fallado: se deshace todo
      this.logger.warn('Pedido cancelado, se deshacen los cambios');
      throw error; // y el error sigue su camino (409, 500...)
    } finally {
      client.release(); // devolvemos la conexión al Pool, pase lo que pase
    }
  }
}
