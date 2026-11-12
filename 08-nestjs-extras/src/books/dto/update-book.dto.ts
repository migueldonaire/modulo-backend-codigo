import {
  IsInt,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

// PATCH: todos los campos son opcionales, pero si llegan tienen que ser válidos
export class UpdateBookDto {
  // "Valida este campo solo si ha llegado" (si llega null, también se valida y falla)
  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  author?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsInt()
  @Min(1)
  pages?: number;

  @ValidateIf((_, value) => value !== undefined)
  @IsInt()
  @Min(0)
  stock?: number;
}
