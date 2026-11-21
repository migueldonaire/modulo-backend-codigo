import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

// Una línea del pedido: qué libro y cuántos ejemplares
export class OrderItemDto {
  @IsInt()
  @Min(1)
  bookId: number;

  @IsInt()
  @Min(1)
  @Max(10) // como mucho 10 ejemplares del mismo libro
  quantity: number;
}

// Lo que envía el cliente para hacer un pedido
export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1) // al menos una línea
  @ArrayMaxSize(20)
  @ValidateNested({ each: true }) // valida también cada línea...
  @Type(() => OrderItemDto) // ...usando la clase OrderItemDto
  items: OrderItemDto[];
}
