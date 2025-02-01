import { forwardRef, Module } from '@nestjs/common';
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
import { Client } from '@/client/models/client.model';
import { ClientModule } from '@/client/client.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([Fila, Client]), MailerModule, EmpresaModule, forwardRef(() => ClientModule), ScheduleModule.forRoot()],
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
