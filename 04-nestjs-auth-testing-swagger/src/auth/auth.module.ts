import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshTokensService } from './refresh-tokens.service';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(config.get('JWT_EXPIRES_IN_SECONDS') ?? 900),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokensService],
  // Otros módulos que importen AuthModule podrán usar JwtService (y los guards)
  exports: [JwtModule],
})
export class AuthModule {}
