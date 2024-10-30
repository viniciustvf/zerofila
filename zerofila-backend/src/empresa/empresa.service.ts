import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { AccountsEmpresa } from './interfaces/accounts-empresa.interface';
import { Empresa } from './models/empresa.model';
import { EmpresaDto } from './dto/empresa.dto';
import { EmpresaProfileDto } from './dto/empresa-profile.dto';
import { EmpresaUpdateDto } from './dto/empresa-update.dto';
import { EMPRESA_REPOSITORY_TOKEN } from './repositories/empresa.repository.interface';
import { EmpresaTypeOrmRepository } from './repositories/implementations/empresa.typeorm.repository';

@Injectable()
export class EmpresaService {
  constructor(
    @Inject(EMPRESA_REPOSITORY_TOKEN)
    private readonly empresaRepository: EmpresaTypeOrmRepository,
  ) {}

  public async findAll(): Promise<Empresa[]> {
    return await this.empresaRepository.findAll();
  }

  public async findByEmail(email: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findByEmail(email);

    if (!empresa) {
      throw new NotFoundException(`empresa not found`);
    }

    return empresa;
  }

  public async findBySub(sub: number): Promise<Empresa> {
    const empresa = await this.empresaRepository.findBySub(sub);

    if (!empresa) {
      throw new NotFoundException(`empresa not found`);
    }

    return empresa;
  }

  public async findById(empresaId: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findById(empresaId);

    if (!empresa) {
      throw new NotFoundException(`empresa #${empresaId} not found`);
    }

    return empresa;
  }

  public async create(empresaDto: EmpresaDto): Promise<AccountsEmpresa> {
    try {
      return await this.empresaRepository.create(empresaDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<Empresa> {
    try {
      return await this.empresaRepository.updateByEmail(email);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(
    email: string,
    password: string,
  ): Promise<Empresa> {
    try {
      return await this.empresaRepository.updateByPassword(email, password);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateEmpresaProfile(
    id: string,
    empresaProfileDto: EmpresaProfileDto,
  ): Promise<Empresa> {
    try {
      return await this.empresaRepository.updateEmpresaProfile(id, empresaProfileDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateEmpresa(
    id: string,
    empresaUpdateDto: EmpresaUpdateDto,
  ): Promise<UpdateResult> {
    try {
      return await this.empresaRepository.updateEmpresa(id, empresaUpdateDto);
    } catch (err) {
      throw new BadRequestException('empresa not updated');
    }
  }

  public async deleteEmpresa(id: string): Promise<void> {
    const empresa = await this.findById(id);
    return await this.empresaRepository.deleteEmpresa(empresa);
  }
}
