import { IsInt, IsNumber, IsString, Min, MinLength } from 'class-validator';

// Lo que tiene que enviar el cliente para crear un libro
export class CreateBookDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  author: string;

  @IsNumber() // puede llevar decimales: 9.95
  @Min(0)
  price: number;

  @IsInt() // número entero
  @Min(0)
  stock: number;
}
