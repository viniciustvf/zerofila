import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from '../../constants';
import { Repository } from 'typeorm';
import { HashingService } from '../../shared/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { ClientTypeOrmRepository } from './implementations/client.typeorm.repository';
import { Client } from '../models/client.model';
import { CLIENT_REPOSITORY_TOKEN } from './client.repository.interface';

config();

export const configService = new ConfigService();

export function provideClientRepository(): Provider[] {
  return [
    {
      provide: CLIENT_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: ClientRepoDependenciesProvider) =>
        provideClientRepositoryFactory(dependenciesProvider),
      inject: [ClientRepoDependenciesProvider],
    },
    ClientRepoDependenciesProvider,
  ];
}

async function provideClientRepositoryFactory(
  dependenciesProvider: ClientRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;

  switch (configService.get('CLIENT_DATASOURCE')) {
    case DataSource.TYPEORM:
      return new ClientTypeOrmRepository(
        dependenciesProvider.typeOrmRepository,
        dependenciesProvider.hashingService,
      );
  }
}

@Injectable()
export class ClientRepoDependenciesProvider {
  constructor(
    @InjectRepository(Client)
    public typeOrmRepository: Repository<Client>,
    public hashingService: HashingService,
  ) {}
}
