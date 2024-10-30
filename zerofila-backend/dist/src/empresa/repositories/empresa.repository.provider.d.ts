import { Provider } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Empresa } from '../models/empresa.model';
import { HashingService } from '../../shared/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';
export declare const configService: ConfigService<Record<string, unknown>, false>;
export declare function provideEmpresaRepository(): Provider[];
export declare class EmpresaRepoDependenciesProvider {
    typeOrmRepository: Repository<Empresa>;
    hashingService: HashingService;
    constructor(typeOrmRepository: Repository<Empresa>, hashingService: HashingService);
}
