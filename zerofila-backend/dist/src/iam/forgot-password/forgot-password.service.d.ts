import { Repository } from 'typeorm';
import { Empresa } from '../../empresa/models/empresa.model';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '../../shared/mailer/mailer.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { HashingService } from '../../shared/hashing/hashing.service';
export declare class ForgotPasswordService {
    private readonly empresaRepository;
    private readonly mailerService;
    private readonly utilsService;
    private readonly hashingService;
    constructor(empresaRepository: Repository<Empresa>, mailerService: MailerService, utilsService: UtilsService, hashingService: HashingService);
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any>;
    private sendMailForgotPassword;
}
