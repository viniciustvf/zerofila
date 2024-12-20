import { Repository, UpdateResult } from 'typeorm';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { ClientRepository } from '../client.repository.interface';
import { Client } from '@/client/models/client.model';

export class ClientTypeOrmRepository implements ClientRepository {
  constructor(
    private readonly clientRepository: Repository<Client>,
    private readonly hashingService: HashingService,
  ) {}

  public async findAll() {
    return await this.clientRepository.find();
  }

  public async findById(clientId: string): Promise<Client | null> {
    return await this.clientRepository.findOneBy({
      id: +clientId,
    });
  }

  public async findByFilaId(filaId: number): Promise<Client[]> {
    return await this.clientRepository.find({
      where: { fila: { id: filaId } },
      relations: ['fila'],
    });
  }

  public async create(client: Client): Promise<Client> {
    return await this.clientRepository.save(client);
  }

  public async updateClient(
    id: string,
    client: Client,
  ): Promise<UpdateResult> {
    console.log(client)
    return await this.clientRepository.update(
      {
        id: +id,
      },
      { ...client },
    );
  }

  public async deleteClient(Client: any): Promise<void> {
    await this.clientRepository.remove(Client);
  }
}
