import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from '../../empresa/models/empresa.model';
import { JwtModule } from '@nestjs/jwt';
import { EmpresaService } from '../../empresa/empresa.service';
import { ConfigModule } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication/authentication.guard';
import { AccessTokenGuard } from './guards/access-token/access-token.guard';
import jwtConfig from './config/jwt.config';
import { provideEmpresaRepository } from '../../empresa/repositories/empresa.repository.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Empresa]),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
    LoginService,
    EmpresaService,
    ...provideEmpresaRepository(),
  ],
  controllers: [LoginController],
})
export class LoginModule {}
