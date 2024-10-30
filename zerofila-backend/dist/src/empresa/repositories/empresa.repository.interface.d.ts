import { EmpresaProfileDto } from '../dto/empresa-profile.dto';
import { EmpresaUpdateDto } from '../dto/empresa-update.dto';
import { EmpresaDto } from '../dto/empresa.dto';
export interface EmpresaRepository {
    findAll(): void;
    findByEmail(email: string): void;
    findBySub(sub: number): void;
    findById(empresaId: string): void;
    create(empresaDto: EmpresaDto): void;
    updateByEmail(email: string): void;
    updateByPassword(email: string, password: string): void;
    updateEmpresaProfile(id: string, empresaProfileDto: EmpresaProfileDto): void;
    updateEmpresa(id: string, empresaUpdateDto: EmpresaUpdateDto): void;
    deleteEmpresa(id: string): void;
}
export declare const EMPRESA_REPOSITORY_TOKEN = "empresa-repository-token";
