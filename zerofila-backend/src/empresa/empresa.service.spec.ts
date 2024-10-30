import { HttpException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BcryptService } from '../shared/hashing/bcrypt.service';
import { HashingService } from '../shared/hashing/hashing.service';
import { EmpresaDto } from './dto/empresa.dto';
import { EmpresaService } from './empresa.service';
import { EmpresaTypeOrmRepository } from './repositories/implementations/empresa.typeorm.repository';
import { EMPRESA_REPOSITORY_TOKEN } from './repositories/empresa.repository.interface';

const userArray = [
  {
    id: 1,
    name: 'name #1',
    username: 'username #1',
    email: 'test1@example.com',
    password: 'pass123',
  },
  {
    id: 2,
    name: 'name #2',
    username: 'username #2',
    email: 'test2@example.com',
    password: 'pass123',
  },
];

const oneEmpresa = {
  id: 1,
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const createEmpresa: EmpresaDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const updateEmpresaByEmail = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const updateEmpresaByPassword = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const updateEmpresaProfile = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'pass123',
};

const updateEmpresa = {
  id: 1,
  name: 'name #1 update',
  username: 'username #1 update',
  email: 'test@example.com',
  password: 'pass123',
};

describe('EmpresaService', () => {
  let service: EmpresaService;
  let repository: EmpresaTypeOrmRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpresaService,
        {
          provide: HashingService,
          useClass: BcryptService,
        },
        {
          provide: EMPRESA_REPOSITORY_TOKEN,
          useValue: {
            findAll: jest.fn().mockResolvedValue(userArray),
            findByEmail: jest.fn().mockResolvedValue(oneEmpresa),
            findBySub: jest.fn().mockResolvedValueOnce(oneEmpresa),
            findById: jest.fn().mockResolvedValueOnce(oneEmpresa),
            create: jest.fn().mockReturnValue(createEmpresa),
            updateByEmail: jest.fn().mockReturnValue(updateEmpresaByEmail),
            updateByPassword: jest.fn().mockResolvedValue(updateEmpresaByPassword),
            updateEmpresaProfile: jest.fn().mockResolvedValue(updateEmpresaProfile),
            updateEmpresa: jest.fn().mockResolvedValue(updateEmpresa),
            deleteEmpresa: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmpresaService>(EmpresaService);
    repository = module.get(EMPRESA_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll() method', () => {
    it('should return an array of all empresa', async () => {
      const empresa = await service.findAll();
      expect(empresa).toEqual(userArray);
    });
  });

  describe('findByEmail() method', () => {
    it('should find a empresa by email', async () => {
      expect(await service.findByEmail('test@example.com')).toEqual(oneEmpresa);
    });

    it('should throw an exception if it not found a empresa by email', async () => {
      repository.findByEmail = jest.fn().mockResolvedValueOnce(null);
      await expect(service.findByEmail('not a correct email')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySub() method', () => {
    it('should find a empresa by sub or fail', async () => {
      expect(await service.findBySub(1)).toEqual(oneEmpresa);
    });

    it('should throw an exception if it not found a empresa by sub', async () => {
      repository.findBySub = jest.fn().mockResolvedValueOnce(null);
      await expect(service.findBySub(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById() method', () => {
    it('should find a empresa by id', async () => {
      expect(await service.findById('anyid')).toEqual(oneEmpresa);
    });

    it('should throw an exception if it not found a empresa by id', async () => {
      repository.findById = jest.fn().mockResolvedValueOnce(null);
      await expect(service.findById('not a correct id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create() method', () => {
    it('should create a new empresa', async () => {
      expect(
        await service.create({
          name: 'name #1',
          username: 'username #1',
          email: 'test@example.com',
          password: 'pass123',
        }),
      ).toEqual(createEmpresa);
    });

    it('should return an exception if login fails', async () => {
      repository.create = jest.fn().mockRejectedValueOnce(null);
      await expect(
        service.create({
          name: 'not a correct name',
          username: 'not a correct username',
          email: 'not a correct email',
          password: 'not a correct password',
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateByEmail() method', () => {
    it('should update a empresa by email', async () => {
      expect(await service.updateByEmail('test@example.com')).toEqual(
        updateEmpresaByEmail,
      );
    });

    it('should return an exception if update by email fails', async () => {
      repository.updateByEmail = jest.fn().mockRejectedValueOnce(null);
      await expect(
        service.updateByEmail('not a correct email'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateByPassword() method', () => {
    it('should update a empresa by password', async () => {
      expect(
        await service.updateByPassword('test@example.com', 'pass123'),
      ).toEqual(updateEmpresaByPassword);
    });

    it('should return an exception if update by password fails', async () => {
      repository.updateByPassword = jest.fn().mockRejectedValueOnce(null);
      await expect(
        service.updateByPassword('not a correct email', 'not correct password'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateEmpresaProfile() method', () => {
    it('should update profile of a empresa by id', async () => {
      expect(
        await service.updateEmpresaProfile('anyid', updateEmpresaProfile),
      ).toEqual(updateEmpresaProfile);
    });

    it('should return an exception if update profile empresa fails', async () => {
      repository.updateEmpresaProfile = jest.fn().mockRejectedValueOnce(null);
      await expect(
        service.updateEmpresaProfile('not a correct id', {
          name: 'not a correct name',
          username: 'not a correct username',
          email: 'not a correct email',
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateEmpresa() method', () => {
    it('should update a empresa by id', async () => {
      expect(await service.updateEmpresa('anyid', updateEmpresa)).toEqual(updateEmpresa);
    });

    it('should return an exception if update profile empresa fails', async () => {
      repository.updateEmpresa = jest.fn().mockRejectedValueOnce(null);
      await expect(
        service.updateEmpresa('not a correct id', {
          name: 'not a correct name',
          username: 'not a correct username',
          email: 'not a correct email',
          password: 'not a correct password',
        }),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteEmpresa() method', () => {
    it('should remove a empresa by id', async () => {
      const removeSpy = jest.spyOn(repository, 'deleteEmpresa');
      const empresa = await service.deleteEmpresa('any id');
      expect(removeSpy).toHaveBeenCalledWith(oneEmpresa);
      expect(empresa).toBeUndefined();
    });

    it('should throw an error if no empresa is found with an id', async () => {
      repository.findById = jest.fn().mockResolvedValueOnce(undefined);
      await expect(service.deleteEmpresa('bad id')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
