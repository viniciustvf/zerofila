import { EmpresaService } from './empresa.service';
import { EmpresaProfileDto } from './dto/empresa-profile.dto';
import { EmpresaUpdateDto } from './dto/empresa-update.dto';
import { AccountsEmpresa } from './interfaces/accounts-empresa.interface';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    findAllEmpresa(): Promise<AccountsEmpresa[]>;
    findOneEmpresa(empresaId: string): Promise<AccountsEmpresa>;
    getEmpresa(empresaId: string): Promise<any>;
    updateEmpresaProfile(empresaId: string, empresaProfileDto: EmpresaProfileDto): Promise<any>;
    updateEmpresa(empresaId: string, empresaUpdateDto: EmpresaUpdateDto): Promise<any>;
    deleteEmpresa(empresaId: string): Promise<void>;
}
