import { IsInt, IsString, MaxLength, Min, MinLength } from 'class-validator';

// Lo que tiene que enviar el cliente para crear un libro
export class CreateBookDto {
  @IsString() // tiene que ser texto
  @MinLength(1) // no puede estar vacío
  @MaxLength(200) // como mucho 200 caracteres
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  author: string;

  @IsInt() // número entero
  @Min(1) // al menos 1 página
  pages: number;
}
