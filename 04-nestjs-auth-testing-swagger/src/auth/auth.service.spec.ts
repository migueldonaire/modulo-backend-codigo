import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { RefreshTokensService } from './refresh-tokens.service';

describe('AuthService', () => {
  let authService: AuthService;

  // Dobles de prueba (mocks): sustituyen a las piezas reales
  const usersServiceMock = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const jwtServiceMock = {
    signAsync: jest.fn(),
  };
  const configServiceMock = {
    get: jest.fn().mockReturnValue('900'),
  };
  const refreshTokensMock = {
    create: jest.fn().mockResolvedValue('refresh-de-prueba'),
    consume: jest.fn(),
    revoke: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: RefreshTokensService, useValue: refreshTokensMock },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  describe('login', () => {
    it('rechaza un correo que no existe', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(undefined);

      await expect(
        authService.login({ email: 'nadie@local.test', password: 'loquesea' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('rechaza una contraseña incorrecta', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({
        id: 1,
        email: 'ana@local.test',
        password_hash: await argon2.hash('laBuenaPassword1'),
        role: 'user',
      });

      await expect(
        authService.login({ email: 'ana@local.test', password: 'otraCosa' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('no crea un token si la contraseña es incorrecta', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({
        id: 1,
        email: 'ana@local.test',
        password_hash: await argon2.hash('laBuenaPassword1'),
        role: 'user',
      });

      await expect(
        authService.login({ email: 'ana@local.test', password: 'otraCosa' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(jwtServiceMock.signAsync).not.toHaveBeenCalled();
    });

    it('devuelve un token si las credenciales son correctas', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({
        id: 1,
        email: 'ana@local.test',
        password_hash: await argon2.hash('laBuenaPassword1'),
        role: 'user',
      });
      jwtServiceMock.signAsync.mockResolvedValue('token-de-prueba');

      const result = await authService.login({
        email: 'ana@local.test',
        password: 'laBuenaPassword1',
      });

      expect(result.accessToken).toBe('token-de-prueba');
      expect(result.refreshToken).toBe('refresh-de-prueba');
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({
        sub: 1,
        email: 'ana@local.test',
        role: 'user',
      });
    });
  });

  describe('register', () => {
    it('rechaza un correo ya registrado', async () => {
      usersServiceMock.findByEmail.mockResolvedValue({ id: 1 });

      await expect(
        authService.register({
          email: 'ana@local.test',
          password: 'unaPasswordLarga1',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('guarda un hash, no la contraseña', async () => {
      usersServiceMock.findByEmail.mockResolvedValue(undefined);
      usersServiceMock.create.mockResolvedValue({
        id: 7,
        email: 'luis@local.test',
        password_hash: 'lo-que-sea',
        role: 'user',
      });

      const result = await authService.register({
        email: 'luis@local.test',
        password: 'unaPasswordLarga1',
      });

      // ¿Con qué argumentos se llamó a create?
      const [, passwordHash] = usersServiceMock.create.mock.calls[0] as [
        string,
        string,
      ];
      expect(passwordHash).not.toBe('unaPasswordLarga1');
      expect(await argon2.verify(passwordHash, 'unaPasswordLarga1')).toBe(true);

      // La respuesta no incluye el hash
      expect(result).toEqual({ id: 7, email: 'luis@local.test', role: 'user' });
    });
  });
});
