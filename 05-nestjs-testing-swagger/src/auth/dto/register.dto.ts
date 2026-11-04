import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail() // tiene que parecer un correo
  email: string;

  @IsString()
  @MinLength(8) // contraseñas de al menos 8 caracteres
  password: string;
}
