import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from '../../shared/hashing/bcrypt.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerModule } from '../../shared/mailer/mailer.module';
import { Empresa } from '../../empresa/models/empresa.model';
import { EmpresaService } from '../../empresa/empresa.service';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';
import { provideEmpresaRepository } from '../../empresa/repositories/empresa.repository.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa]), MailerModule],
  controllers: [RegisterController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    RegisterService,
    EmpresaService,
    ...provideEmpresaRepository(),
  ],
})
export class RegisterModule {}
