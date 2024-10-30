import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from '../../shared/hashing/hashing.service';
import { LoginService } from './login.service';
import { EmpresaService } from '../../empresa/empresa.service';
import { Empresa } from '../../empresa/models/empresa.model';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException, HttpException } from '@nestjs/common';
import jwtConfig from './config/jwt.config';

const oneEmpresa = {
  id: 1,
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const loginDto: LoginDto = {
  email: 'test@example.com',
  password: 'pass123',
};

const empresaLogin = {
  accessToken: undefined as any,
  refreshToken: undefined as any,
  empresa: {
    id: 1,
    name: 'name #1',
    email: 'test@example.com',
  },
};

const payload = {
  id: 1,
  name: 'name #1',
  email: 'test@example.com',
};

const refreshTokenDto = {
  refreshToken: 'token',
};

const id = 1;

describe('LoginService', () => {
  let loginService: LoginService;
  let empresaService: EmpresaService;
  let hashingService: HashingService;
  let config: ConfigType<typeof jwtConfig>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(jwtConfig)],
      providers: [
        LoginService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            signToken: jest.fn(() => payload),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some string'),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(() => Promise.resolve('pass123')),
            compare: jest.fn(() => Promise.resolve(true)),
          },
        },
        {
          provide: EmpresaService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(oneEmpresa),
            findBySub: jest.fn().mockResolvedValue(oneEmpresa),
          },
        },
        {
          provide: getRepositoryToken(Empresa),
          useValue: {
            findByEmail: jest.fn(),
            findOneBy: jest.fn().mockReturnValue(oneEmpresa),
            findOne: jest.fn().mockReturnValue(oneEmpresa),
            findBySub: jest.fn().mockReturnValueOnce(oneEmpresa),
          },
        },
      ],
    }).compile();

    config = module.get<ConfigType<typeof jwtConfig>>(jwtConfig.KEY);
    loginService = module.get<LoginService>(LoginService);
    empresaService = module.get<EmpresaService>(EmpresaService);
    hashingService = module.get<HashingService>(HashingService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(loginService).toBeDefined();
  });

  describe('findEmpresaByEmail() method', () => {
    it('should find a empresa by email', async () => {
      expect(await loginService.findEmpresaByEmail(loginDto)).toEqual(oneEmpresa);
    });

    it('should generate token jwt', async () => {
      expect(await loginService.login(loginDto)).toEqual(empresaLogin);
    });

    it('should generate refresh token jwt', async () => {
      empresaService.findBySub = jest.fn().mockResolvedValueOnce(oneEmpresa);
      jwtService.verifyAsync = jest.fn(() => id as any);

      expect(
        await loginService.refreshTokens({
          refreshToken: 'token',
        }),
      ).toEqual(empresaLogin);
    });

    it('should return an exception if refresh token fails', async () => {
      empresaService.findBySub = jest.fn().mockResolvedValueOnce(null);
      await expect(
        loginService.refreshTokens({
          refreshToken: 'not a correct token jwt',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return an exception if wrong password', async () => {
      empresaService.findByEmail = jest.fn().mockResolvedValueOnce(oneEmpresa);
      hashingService.compare = jest.fn().mockResolvedValueOnce(false);
      await expect(
        loginService.login({
          email: 'someemail@test.com',
          password: 'not a correct password',
        }),
      ).rejects.toThrow(HttpException);
    });

    it('should return an exception if login fails', async () => {
      empresaService.findByEmail = jest.fn().mockResolvedValueOnce(null);
      await expect(
        loginService.login({
          email: 'not a correct email',
          password: 'not a correct password',
        }),
      ).rejects.toThrow(HttpException);
    });
  });
});
