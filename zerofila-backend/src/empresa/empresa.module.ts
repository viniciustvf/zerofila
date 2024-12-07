import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './models/empresa.model';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { MailerModule } from '../shared/mailer/mailer.module';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { provideEmpresaRepository } from './repositories/empresa.repository.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa]), MailerModule],
  controllers: [EmpresaController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    EmpresaService,
    ...provideEmpresaRepository(),
  ],
  exports: [...provideEmpresaRepository()],
})
export class EmpresaModule {}
