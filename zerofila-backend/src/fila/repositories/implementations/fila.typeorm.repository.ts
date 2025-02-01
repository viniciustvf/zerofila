import { Repository, UpdateResult } from 'typeorm';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { FilaRepository } from '../fila.repository.interface';
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

  public async findByIdWithRelations(filaId: string): Promise<Fila | null> {
    return await this.filaRepository
      .createQueryBuilder('fila')
      .leftJoinAndSelect('fila.clients', 'client')
      .leftJoinAndSelect('fila.calledClient', 'calledClient')
      .leftJoinAndSelect('fila.empresa', 'empresa')
      .where('fila.id = :filaId', { filaId })
      .getOne();
  }

  public async findClientCalledByFilaId(filaId: string): Promise<Fila | null> {
    return await this.filaRepository
      .createQueryBuilder('fila')
      .leftJoinAndSelect('fila.calledClient', 'calledClient')
      .where('fila.id = :filaId', { filaId })
      .getOne();
  }

  public async findAllByEmpresaId(empresaId: number): Promise<Fila[]> {
    const filas = await this.filaRepository.find({
      where: { empresa: { id: empresaId } },
      relations: ['empresa', 'clients', 'calledClient'],
    });

    return filas.map((fila) => ({
      ...fila,
      qtdClients: fila.clients ? fila.clients.length : 0,
    }));
  }

  public async create(fila: Fila): Promise<Fila> {
    return await this.filaRepository.save(fila);
  }

  public async updateFila(
    id: string,
    fila: Fila,
  ): Promise<UpdateResult> {
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
