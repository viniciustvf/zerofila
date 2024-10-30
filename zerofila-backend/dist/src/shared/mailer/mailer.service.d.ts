import { ConfigService } from '@nestjs/config';
export declare class MailerService {
    private readonly configService;
    private nodemailerTransport;
    constructor(configService: ConfigService);
    sendMail(options: any): Promise<any>;
}
