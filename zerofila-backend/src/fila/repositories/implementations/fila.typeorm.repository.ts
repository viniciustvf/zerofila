import { Repository, UpdateResult } from 'typeorm';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { FilaRepository } from '../fila.repository.interface';
import { FilaDto } from '@/fila/dto/fila.dto';
import { FilaUpdateDto } from '@/fila/dto/fila-update.dto';
import { Fila } from '@/fila/models/fila.model';

export class FilaTypeOrmRepository implements FilaRepository {
  constructor(
    private readonly filaRepository: Repository<Fila>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll() {
    return await this.filaRepository.find();
  }

  public async findById(filaId: string): Promise<Fila | null> {
    return await this.filaRepository.findOneBy({
      id: +filaId,
    });
  }

  public async create(filaDto: FilaDto): Promise<Fila> {
    return await this.filaRepository.save(filaDto);
  }

  public async updateFila(
    id: string,
    filaUpdateDto: FilaUpdateDto,
  ): Promise<UpdateResult> {
    return await this.filaRepository.update(
      {
        id: +id,
      },
      { ...filaUpdateDto },
    );
  }

  public async deleteFila(Fila: any): Promise<void> {
    await this.filaRepository.remove(Fila);
  }
}
