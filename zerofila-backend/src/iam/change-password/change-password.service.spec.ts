import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordService } from './change-password.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Empresa } from '../../empresa/models/empresa.model';
import { Repository } from 'typeorm';
import { EmpresaService } from '../../empresa/empresa.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';

const changePasswordEmpresa = {
  email: 'test@example.it',
  password: '1234567',
};

describe('ChangePasswordService', () => {
  let service: ChangePasswordService;
  let repository: Repository<Empresa>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePasswordService,
        {
          provide: EmpresaService,
          useValue: {
            updateByPassword: jest.fn().mockResolvedValue(changePasswordEmpresa),
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('some string'),
          },
        },
        {
          provide: getRepositoryToken(Empresa),
          useValue: {
            findOneBy: jest.fn(),
            updateByPassword: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChangePasswordService>(ChangePasswordService);
    repository = module.get<Repository<Empresa>>(getRepositoryToken(Empresa));
  });

  describe('change password empresa', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should change password a empresa', () => {
      expect(
        service.changePassword({
          email: 'test@example.it',
          password: '1234567',
        }),
      ).resolves.toEqual(changePasswordEmpresa);
    });
  });
});
