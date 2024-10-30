import { Injectable, Logger } from '@nestjs/common';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { AccountsEmpresa } from '../../empresa/interfaces/accounts-empresa.interface';
import { EmpresaService } from '../../empresa/empresa.service';
import { RegisterEmpresaDto } from './dto/register-empresa.dto';
import { registrationEmail } from '../../shared/mailer/mailer.constants';

@Injectable()
export class RegisterService {
  constructor(
    private readonly empresaService: EmpresaService,
    private readonly mailerService: MailerService,
    private readonly hashingService: HashingService,
  ) {}

  public async register(
    registerEmpresaDto: RegisterEmpresaDto,
  ): Promise<AccountsEmpresa> {
    registerEmpresaDto.password = await this.hashingService.hash(
      registerEmpresaDto.password,
    );

    this.sendMailRegisterEmpresa(registerEmpresaDto);

    return this.empresaService.create(registerEmpresaDto);
  }

  private sendMailRegisterEmpresa(user: RegisterEmpresaDto): void {
    try {
      this.mailerService.sendMail({
        to: user.email,
        from: 'from@example.com',
        subject: 'Registration successful ✔',
        html: registrationEmail(user),
      });
      Logger.log('[MailService] Empresa Registration: Send Mail successfully!');
    } catch (err) {
      Logger.error('[MailService] Empresa Registration: Send Mail failed!', err);
    }
  }
}
