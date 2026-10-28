import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserRecord, UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokensService } from './refresh-tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly refreshTokens: RefreshTokensService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Ese correo ya está registrado');
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.usersService.create(dto.email, passwordHash);

    // Nunca devolvemos el hash
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    // Mismo mensaje si no existe el usuario o si falla la contraseña
    if (!user || !(await argon2.verify(user.password_hash, dto.password))) {
      throw new UnauthorizedException('Credenciales no válidas');
    }

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    // El token se gasta: si alguien lo vuelve a usar, ya no existe
    const userId = await this.refreshTokens.consume(refreshToken);
    const user = userId ? await this.usersService.findById(userId) : undefined;

    if (!user) {
      throw new UnauthorizedException('Refresh token no válido');
    }

    return this.issueTokens(user);
  }

  async logout(refreshToken: string) {
    await this.refreshTokens.revoke(refreshToken);
  }

  async logoutAll(userId: number) {
    await this.refreshTokens.revokeAllForUser(userId);
  }

  // Crea un access token nuevo y un refresh token nuevo
  private async issueTokens(user: UserRecord) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = await this.refreshTokens.create(user.id);

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: Number(this.config.get('JWT_EXPIRES_IN_SECONDS') ?? 900),
    };
  }
}
