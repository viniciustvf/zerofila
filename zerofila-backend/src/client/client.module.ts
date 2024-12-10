import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '../shared/mailer/mailer.module';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { ClientController } from './client.controller';
import { Client } from './models/client.model';
import { ClientService } from './client.service';
import { provideClientRepository } from './repositories/client.repository.provider';
import { FilaModule } from '@/fila/fila.module';
import { EmpresaModule } from '@/empresa/empresa.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), MailerModule, forwardRef(() => FilaModule), EmpresaModule],
  controllers: [ClientController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    ClientService,
    ...provideClientRepository(),
  ],
  exports: [...provideClientRepository()],
})
export class ClientModule {}
