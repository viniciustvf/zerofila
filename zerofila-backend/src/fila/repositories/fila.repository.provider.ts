import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from '../../constants';
import { Repository } from 'typeorm';
import { HashingService } from '../../shared/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { FILA_REPOSITORY_TOKEN } from './fila.repository.interface';
import { FilaTypeOrmRepository } from './implementations/fila.typeorm.repository';
import { Fila } from '../models/fila.model';

config();

export const configService = new ConfigService();

export function provideFilaRepository(): Provider[] {
  return [
    {
      provide: FILA_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: FilaRepoDependenciesProvider) =>
        provideFilaRepositoryFactory(dependenciesProvider),
      inject: [FilaRepoDependenciesProvider],
    },
    FilaRepoDependenciesProvider,
  ];
}

async function provideFilaRepositoryFactory(
  dependenciesProvider: FilaRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;

  switch (configService.get('FILA_DATASOURCE')) {
    case DataSource.TYPEORM:
      return new FilaTypeOrmRepository(
        dependenciesProvider.typeOrmRepository,
        dependenciesProvider.hashingService,
      );
  }
}

@Injectable()
export class FilaRepoDependenciesProvider {
  constructor(
    @InjectRepository(Fila)
    public typeOrmRepository: Repository<Fila>,
    public hashingService: HashingService,
  ) {}
}
