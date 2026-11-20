import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { Order } from './order';

@Controller()
export class NotificationsController {
  // @EventPattern: escucha un evento. No devuelve nada: nadie espera respuesta
  @EventPattern('order-created')
  sendEmail(@Payload() order: Order) {
    // De mentira: en un proyecto real aquí se enviaría un email de verdad
    console.log(
      `📧 Email enviado: pedido ${order.id}, ${order.quantity} x "${order.title}", total ${order.total} €`,
    );
  }
}
