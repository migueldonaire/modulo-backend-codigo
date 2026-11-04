import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Ese correo ya está registrado'); // → 409
    }

    // Guardamos el HASH, nunca la contraseña
    const passwordHash = await argon2.hash(dto.password);
    const user = await this.usersService.create(dto.email, passwordHash);

    // Respondemos sin el hash
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // Mismo mensaje si el correo no existe o si la contraseña está mal:
    // así nadie puede averiguar qué correos están registrados
    if (!user || !(await argon2.verify(user.password_hash, dto.password))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos'); // → 401
    }

    const payload: JwtPayload = { sub: user.id }; // solo el id
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }

  // GET /api/auth/me: buscamos al usuario en la base de datos
  async me(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe'); // → 401
    }
    return { id: user.id, email: user.email, role: user.role }; // sin el hash
  }
}
