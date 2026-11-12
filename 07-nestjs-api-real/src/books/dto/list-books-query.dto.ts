import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// Lo que se puede poner en la query de GET /api/v2/books
export class ListBooksQueryDto {
  @IsOptional() // si no llega, se usa el valor por defecto (= 1)
  @Type(() => Number) // en la URL todo es texto: "2" → 2
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50) // nadie puede pedir un millón de libros de golpe
  limit: number = 10;

  @IsOptional()
  @IsIn(['id', 'title', 'pages']) // solo se puede ordenar por estos campos
  sort: 'id' | 'title' | 'pages' = 'id';

  @IsOptional()
  @IsIn(['asc', 'desc']) // asc = de menor a mayor, desc = de mayor a menor
  order: 'asc' | 'desc' = 'asc';

  @IsOptional()
  @IsString()
  author?: string;
}
