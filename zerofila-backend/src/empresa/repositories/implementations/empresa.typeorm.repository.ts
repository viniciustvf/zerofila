import { Empresa } from '../../../empresa/models/empresa.model';
import { EmpresaRepository } from '../empresa.repository.interface';
import { Repository, UpdateResult } from 'typeorm';
import { EmpresaProfileDto } from '../../../empresa/dto/empresa-profile.dto';
import { EmpresaUpdateDto } from '../../../empresa/dto/empresa-update.dto';
import { EmpresaDto } from '../../../empresa/dto/empresa.dto';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { AccountsEmpresa } from '../../../empresa/interfaces/accounts-empresa.interface';

export class EmpresaTypeOrmRepository implements EmpresaRepository {
  constructor(
    private readonly empresaRepository: Repository<Empresa>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll() {
    return await this.empresaRepository.find();
  }

  public async findByEmail(email: string) {
    return await this.empresaRepository.findOneBy({
      email: email,
    });
  }

  public async findBySub(sub: number): Promise<Empresa> {
    return await this.empresaRepository.findOneByOrFail({
      id: sub,
    });
  }

  public async findById(empresaId: string): Promise<Empresa | null> {
    return await this.empresaRepository.findOneBy({
      id: +empresaId,
    });
  }

  public async create(empresaDto: EmpresaDto): Promise<AccountsEmpresa> {
    return await this.empresaRepository.save(empresaDto);
  }

  public async updateByEmail(email: string): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOneBy({ email: email });
    empresa.password = await this.hashingService.hash(
      Math.random().toString(36).slice(-8),
    );

    return await this.empresaRepository.save(empresa);
  }

  public async updateByPassword(
    email: string,
    password: string,
  ): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOneBy({ email: email });
    empresa.password = await this.hashingService.hash(password);

    return await this.empresaRepository.save(empresa);
  }

  public async updateEmpresaProfile(
    id: string,
    empresaProfileDto: EmpresaProfileDto,
  ): Promise<Empresa> {
    const empresa = await this.empresaRepository.findOneBy({ id: +id });
    empresa.name = empresaProfileDto.name;
    empresa.email = empresaProfileDto.email;
    empresa.username = empresaProfileDto.username;

    return await this.empresaRepository.save(empresa);
  }

  public async updateEmpresa(
    id: string,
    empresaUpdateDto: EmpresaUpdateDto,
  ): Promise<UpdateResult> {
    return await this.empresaRepository.update(
      {
        id: +id,
      },
      { ...empresaUpdateDto },
    );
  }

  public async deleteEmpresa(Empresa: any): Promise<void> {
    await this.empresaRepository.remove(Empresa);
  }
}
