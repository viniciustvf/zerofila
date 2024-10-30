import { Empresa } from '../../../empresa/models/empresa.model';
import { EmpresaRepository } from '../empresa.repository.interface';
import { Repository, UpdateResult } from 'typeorm';
import { EmpresaProfileDto } from '../../../empresa/dto/empresa-profile.dto';
import { EmpresaUpdateDto } from '../../../empresa/dto/empresa-update.dto';
import { EmpresaDto } from '../../../empresa/dto/empresa.dto';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { AccountsEmpresa } from '../../../empresa/interfaces/accounts-empresa.interface';
export declare class EmpresaTypeOrmRepository implements EmpresaRepository {
    private readonly empresaRepository;
    private readonly hashingService;
    constructor(empresaRepository: Repository<Empresa>, hashingService: HashingService);
    findAll(): Promise<Empresa[]>;
    findByEmail(email: string): Promise<Empresa>;
    findBySub(sub: number): Promise<Empresa>;
    findById(empresaId: string): Promise<Empresa | null>;
    create(empresaDto: EmpresaDto): Promise<AccountsEmpresa>;
    updateByEmail(email: string): Promise<Empresa>;
    updateByPassword(email: string, password: string): Promise<Empresa>;
    updateEmpresaProfile(id: string, empresaProfileDto: EmpresaProfileDto): Promise<Empresa>;
    updateEmpresa(id: string, empresaUpdateDto: EmpresaUpdateDto): Promise<UpdateResult>;
    deleteEmpresa(Empresa: any): Promise<void>;
}
