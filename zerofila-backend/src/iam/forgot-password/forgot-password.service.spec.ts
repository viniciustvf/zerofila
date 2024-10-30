import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Empresa } from '../../empresa/models/empresa.model';
import { ForgotPasswordService } from './forgot-password.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { UtilsService } from '../../shared/utils/utils.service';
import { ConfigService } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { Repository } from 'typeorm';
import { EmpresaService } from '../../empresa/empresa.service';

const oneEmpresa = {
  email: 'test@example.com',
};

const empresa = {
  email: 'test@example.com',
  password: 'pass123',
};

describe('ForgotPasswordService', () => {
  let service: ForgotPasswordService;
  let repository: Repository<Empresa>;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgotPasswordService,
        {
          provide: EmpresaService,
          useValue: {
            forgotPassword: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Empresa),
          useValue: {
            findOneBy: jest.fn(() => oneEmpresa),
            save: jest.fn(() => empresa),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn(() => 'pass123'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some string'),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        UtilsService,
      ],
    }).compile();

    service = module.get<ForgotPasswordService>(ForgotPasswordService);
    mailerService = module.get<MailerService>(MailerService);
    repository = module.get<Repository<Empresa>>(getRepositoryToken(Empresa));
  });

  describe('forgot password empresa', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should generate a new password for empresa by email', async () => {
      expect(
        await service.forgotPassword({
          email: 'test@example.com',
        }),
      ).toEqual(oneEmpresa);
    });
  });
});
