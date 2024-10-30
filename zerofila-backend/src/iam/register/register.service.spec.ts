import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaService } from '../../empresa/empresa.service';
import { RegisterService } from './register.service';
import { Empresa } from '../../empresa/models/empresa.model';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HashingService } from '../../shared/hashing/hashing.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { RegisterEmpresaDto } from './dto/register-empresa.dto';

const registerEmpresaDto: RegisterEmpresaDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'password123',
};

describe('RegisterService', () => {
  let service: RegisterService;
  let repository: Repository<Empresa>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: EmpresaService,
          useValue: {
            create: jest.fn().mockResolvedValue(registerEmpresaDto),
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
          provide: HashingService,
          useValue: {
            hash: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Empresa),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    repository = module.get<Repository<Empresa>>(getRepositoryToken(Empresa));
  });

  describe('Create empresa', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should create a empresa during registration', async () => {
      expect(
        await service.register({
          name: 'name #1',
          username: 'username #1',
          email: 'test@example.com',
          password: 'password123',
        }),
      ).toEqual(registerEmpresaDto);
    });
  });
});
