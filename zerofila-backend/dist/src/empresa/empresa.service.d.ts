import { UpdateResult } from 'typeorm';
import { AccountsEmpresa } from './interfaces/accounts-empresa.interface';
import { Empresa } from './models/empresa.model';
import { EmpresaDto } from './dto/empresa.dto';
import { EmpresaProfileDto } from './dto/empresa-profile.dto';
import { EmpresaUpdateDto } from './dto/empresa-update.dto';
import { EmpresaTypeOrmRepository } from './repositories/implementations/empresa.typeorm.repository';
export declare class EmpresaService {
    private readonly empresaRepository;
    constructor(empresaRepository: EmpresaTypeOrmRepository);
    findAll(): Promise<Empresa[]>;
    findByEmail(email: string): Promise<Empresa>;
    findBySub(sub: number): Promise<Empresa>;
    findById(empresaId: string): Promise<Empresa>;
    create(empresaDto: EmpresaDto): Promise<AccountsEmpresa>;
    updateByEmail(email: string): Promise<Empresa>;
    updateByPassword(email: string, password: string): Promise<Empresa>;
    updateEmpresaProfile(id: string, empresaProfileDto: EmpresaProfileDto): Promise<Empresa>;
    updateEmpresa(id: string, empresaUpdateDto: EmpresaUpdateDto): Promise<UpdateResult>;
    deleteEmpresa(id: string): Promise<void>;
}
