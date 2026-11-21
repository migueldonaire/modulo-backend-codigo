import { IsInt, Min } from 'class-validator';

// Lo que tiene que enviar el cliente para hacer un pedido
export class CreateOrderDto {
  @IsInt()
  @Min(1)
  bookId: number;

  @IsInt()
  @Min(1) // al menos 1 unidad
  quantity: number;
}
