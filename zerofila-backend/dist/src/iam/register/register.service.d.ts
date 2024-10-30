import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { AccountsEmpresa } from '../../empresa/interfaces/accounts-empresa.interface';
import { EmpresaService } from '../../empresa/empresa.service';
import { RegisterEmpresaDto } from './dto/register-empresa.dto';
export declare class RegisterService {
    private readonly empresaService;
    private readonly mailerService;
    private readonly hashingService;
    constructor(empresaService: EmpresaService, mailerService: MailerService, hashingService: HashingService);
    register(registerEmpresaDto: RegisterEmpresaDto): Promise<AccountsEmpresa>;
    private sendMailRegisterEmpresa;
}
