import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaProfileDto } from './dto/empresa-profile.dto';
import { EmpresaDto } from './dto/empresa.dto';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';

const userDto: EmpresaDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
  password: 'password123',
};

const userUpdateDto: EmpresaDto = {
  name: 'name #1 update',
  username: 'username #1 update',
  email: 'test@example.com',
  password: 'password123',
};

const userProfileDto: EmpresaProfileDto = {
  name: 'name #1',
  username: 'username #1',
  email: 'test@example.com',
};

describe('Empresa Controller', () => {
  let empresaController: EmpresaController;
  let empresaService: EmpresaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresaController],
      providers: [
        {
          provide: EmpresaService,
          useValue: {
            findAll: jest.fn(() => {}),
            findById: jest.fn(() => userDto),
            updateEmpresaProfile: jest.fn(() => {}),
            updateEmpresa: jest.fn(() => {}),
            deleteEmpresa: jest.fn(() => userDto),
          },
        },
      ],
    }).compile();

    empresaController = module.get<EmpresaController>(EmpresaController);
    empresaService = module.get<EmpresaService>(EmpresaService);
  });

  describe('Empresa Controller', () => {
    it('should be defined', () => {
      expect(empresaController).toBeDefined();
    });

    describe('findAllEmpresa() method', () => {
      it('should call method findAllEmpresa in userService', async () => {
        const createSpy = jest.spyOn(empresaService, 'findAll');

        await empresaController.findAllEmpresa();
        expect(createSpy).toHaveBeenCalled();
      });
    });

    describe('findOneEmpresa() method', () => {
      it('should call method findOneEmpresa in userService', async () => {
        const createSpy = jest.spyOn(empresaService, 'findById');

        await empresaController.findOneEmpresa('anyid');
        expect(createSpy).toHaveBeenCalledWith('anyid');
      });
    });

    describe('findById() method', () => {
      it('should call method getEmpresa in userService', async () => {
        const createSpy = jest.spyOn(empresaService, 'findById');

        await empresaController.getEmpresa('1');
        expect(createSpy).toHaveBeenCalledWith('1');
      });

      it('should return an exception if update empresa fails', async () => {
        empresaService.findById = jest.fn().mockResolvedValueOnce(null);
        await expect(empresaController.getEmpresa('not correct id')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('updateEmpresaProfile() method', () => {
      it('should call method updateProfileEmpresa in userService', async () => {
        const createSpy = jest.spyOn(empresaService, 'updateEmpresaProfile');

        await empresaController.updateEmpresaProfile('1', userProfileDto);
        expect(createSpy).toHaveBeenCalledWith('1', userProfileDto);
      });

      it('should return an exception if update profile empresa fails', async () => {
        empresaService.updateEmpresaProfile = jest.fn().mockRejectedValueOnce(null);
        await expect(
          empresaController.updateEmpresaProfile('not a correct id', {
            name: 'not a correct name',
            username: 'not a correct username',
            email: 'not a correct email',
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('updateEmpresa() method', () => {
      it('should call method updateEmpresa in userService', async () => {
        const createSpy = jest.spyOn(empresaService, 'updateEmpresa');

        await empresaController.updateEmpresa('1', userUpdateDto);
        expect(createSpy).toHaveBeenCalledWith('1', userUpdateDto);
      });

      it('should return an exception if update empresa fails', async () => {
        empresaService.updateEmpresa = jest.fn().mockRejectedValueOnce(null);
        await expect(
          empresaController.updateEmpresa('not a correct id', {
            name: 'not a correct name',
            username: 'not a correct username',
            email: 'not a correct email',
            password: 'not a correct password',
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('deleteEmpresa() method', () => {
      it('should call method deleteEmpresa in userService', async () => {
        const createSpy = jest.spyOn(empresaService, 'deleteEmpresa');

        await empresaController.deleteEmpresa('anyid');
        expect(createSpy).toHaveBeenCalledWith('anyid');
      });
    });
  });
});
