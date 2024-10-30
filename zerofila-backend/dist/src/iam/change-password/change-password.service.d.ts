import { EmpresaService } from '../../empresa/empresa.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { MailerService } from '../../shared/mailer/mailer.service';
export declare class ChangePasswordService {
    private readonly empresaService;
    private readonly mailerService;
    constructor(empresaService: EmpresaService, mailerService: MailerService);
    changePassword(changePasswordDto: ChangePasswordDto): Promise<any>;
    private sendMailChangePassword;
}
