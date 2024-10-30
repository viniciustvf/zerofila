import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresa } from '../../empresa/models/empresa.model';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '../../shared/mailer/mailer.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { HashingService } from '../../shared/hashing/hashing.service';
import { forgotPasswordEmail } from '../../shared/mailer/mailer.constants';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
    private readonly mailerService: MailerService,
    private readonly utilsService: UtilsService,
    private readonly hashingService: HashingService,
  ) {}

  public async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<any> {
    const empresaUpdate = await this.empresaRepository.findOneBy({
      email: forgotPasswordDto.email,
    });
    const passwordRand = this.utilsService.generatePassword();
    empresaUpdate.password = await this.hashingService.hash(passwordRand);

    this.sendMailForgotPassword(empresaUpdate.email, passwordRand);

    return await this.empresaRepository.save(empresaUpdate);
  }

  private sendMailForgotPassword(email: string, password: string): void {
    try {
      this.mailerService.sendMail({
        to: email,
        from: 'from@example.com',
        subject: 'Forgot Password successful ✔',
        text: 'Forgot Password successful!',
        html: forgotPasswordEmail(password),
      });
      Logger.log('[MailService] Forgot Password: Send Mail successfully!');
    } catch (err) {
      Logger.error('[MailService] Forgot Password: Send Mail Failed!', err);
    }
  }
}
