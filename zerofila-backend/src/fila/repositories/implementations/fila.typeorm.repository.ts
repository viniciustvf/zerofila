import { Repository, UpdateResult } from 'typeorm';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { FilaRepository } from '../fila.repository.interface';
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

  public async create(fila: Fila): Promise<Fila> {
    return await this.filaRepository.save(fila);
  }

  public async updateFila(
    id: string,
    fila: Fila,
  ): Promise<UpdateResult> {
    console.log(fila)
    return await this.filaRepository.update(
      {
        id: +id,
      },
      { ...fila },
    );
  }

  public async deleteFila(Fila: any): Promise<void> {
    await this.filaRepository.remove(Fila);
  }
}
