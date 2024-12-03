import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '../shared/mailer/mailer.module';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { FilaController } from './fila.controller';
import { Fila } from './models/fila.model';
import { FilaService } from './fila.service';
import { provideFilaRepository } from './repositories/fila.repository.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Fila]), MailerModule],
  controllers: [FilaController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    FilaService,
    ...provideFilaRepository(),
  ],
})
export class FilaModule {}
