import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '../shared/mailer/mailer.module';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { FilaController } from './fila.controller';
import { Fila } from './models/fila.model';
import { FilaService } from './fila.service';
import { provideFilaRepository } from './repositories/fila.repository.provider';
import { EmpresaModule } from '@/empresa/empresa.module';
import { FilaGateway } from './fila.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Fila]), MailerModule, EmpresaModule],
  controllers: [FilaController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    FilaService,
    ...provideFilaRepository(),
    FilaGateway,
  ],
  exports: [...provideFilaRepository()],
})
export class FilaModule {}
