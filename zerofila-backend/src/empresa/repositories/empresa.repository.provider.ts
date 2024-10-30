import { Injectable, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource } from '../../constants';
import { Repository } from 'typeorm';
import { EMPRESA_REPOSITORY_TOKEN } from './empresa.repository.interface';
import { EmpresaTypeOrmRepository } from './implementations/empresa.typeorm.repository';
import { Empresa } from '../models/empresa.model';
import { HashingService } from '../../shared/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

export const configService = new ConfigService();

export function provideEmpresaRepository(): Provider[] {
  return [
    {
      provide: EMPRESA_REPOSITORY_TOKEN,
      useFactory: async (dependenciesProvider: EmpresaRepoDependenciesProvider) =>
        provideEmpresaRepositoryFactory(dependenciesProvider),
      inject: [EmpresaRepoDependenciesProvider],
    },
    EmpresaRepoDependenciesProvider,
  ];
}

async function provideEmpresaRepositoryFactory(
  dependenciesProvider: EmpresaRepoDependenciesProvider,
) {
  await ConfigModule.envVariablesLoaded;

  switch (configService.get('EMPRESA_DATASOURCE')) {
    case DataSource.TYPEORM:
      return new EmpresaTypeOrmRepository(
        dependenciesProvider.typeOrmRepository,
        dependenciesProvider.hashingService,
      );
  }
}

@Injectable()
export class EmpresaRepoDependenciesProvider {
  constructor(
    @InjectRepository(Empresa)
    public typeOrmRepository: Repository<Empresa>,
    public hashingService: HashingService,
  ) {}
}
