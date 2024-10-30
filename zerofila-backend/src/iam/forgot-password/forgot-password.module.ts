import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';
import { ForgotPasswordController } from './forgot-password.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { UtilsModule } from '../../shared/utils/utils.module';
import { Empresa } from '../../empresa/models/empresa.model';
import { provideEmpresaRepository } from '../../empresa/repositories/empresa.repository.provider';
import { EmpresaService } from '../../empresa/empresa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa]), MailerModule, UtilsModule],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ForgotPasswordService,
    EmpresaService,
    ...provideEmpresaRepository(),
  ],
  controllers: [ForgotPasswordController],
})
export class ForgotPasswordModule {}
