import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmpresaService } from '../../empresa/empresa.service';
import { AccountsEmpresa } from '../../empresa/interfaces/accounts-empresa.interface';
import { LoginDto } from './dto/login.dto';
import { ConfigType } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { JWTPayload } from './interfaces/jwt-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Empresa } from '../../empresa/models/empresa.model';
import jwtConfig from './config/jwt.config';

@Injectable()
export class LoginService {
  constructor(
    private readonly empresaService: EmpresaService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly hashingService: HashingService,
  ) {}

  public async findEmpresaByEmail(loginDto: LoginDto): Promise<AccountsEmpresa> {
    return await this.empresaService.findByEmail(loginDto.email);
  }

  public async login(loginDto: LoginDto): Promise<any> {
    try {
      const empresa = await this.findEmpresaByEmail(loginDto);
      if (!empresa) {
        throw new UnauthorizedException('Empresa does not exists');
      }

      const passwordIsValid = await this.hashingService.compare(
        loginDto.password,
        empresa.password,
      );

      if (!passwordIsValid) {
        throw new UnauthorizedException(
          'Authentication failed. Wrong password',
        );
      }

      return await this.generateTokens(empresa);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async generateTokens(empresa: Empresa) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<JWTPayload>>(
        empresa.id,
        this.jwtConfiguration.accessTokenTtl,
        { email: empresa.email },
      ),
      this.signToken(empresa.id, this.jwtConfiguration.refreshTokenTtl),
    ]);
    return {
      accessToken,
      refreshToken,
      empresa: {
        id: empresa.id,
        name: empresa.name,
        email: empresa.email,
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { id } = await this.jwtService.verifyAsync<Pick<JWTPayload, 'id'>>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      const empresa = await this.empresaService.findBySub(id);
      return this.generateTokens(empresa);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  private async signToken<T>(empresaId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: empresaId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
