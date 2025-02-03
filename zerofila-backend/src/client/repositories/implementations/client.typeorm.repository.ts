import { Between, Repository, UpdateResult } from 'typeorm';
import { HashingService } from '../../../shared/hashing/hashing.service';
import { ClientRepository } from '../client.repository.interface';
import { Client } from '@/client/models/client.model';

export class ClientTypeOrmRepository implements ClientRepository {
  constructor(
    private readonly clientRepository: Repository<Client>,
    private readonly hashingService: HashingService,
  ) {}
  
  async findClientsByEmpresaAndDate(empresaId: string, startDate: string, endDate: string): Promise<Client[]> {
    const queryBuilder = this.clientRepository
      .createQueryBuilder('client')
      .innerJoin('client.fila', 'fila')
      .innerJoin('fila.empresa', 'empresa')
      .where('empresa.id = :empresaId', { empresaId })
      .andWhere('client.entryTime BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('client.entryTime', 'ASC');
  
    const [sql, parameters] = queryBuilder.getQueryAndParameters();
  
    console.log('📌 SQL Gerado:', sql);
    console.log('📌 Parâmetros:', parameters);
  
    return await queryBuilder.getMany();
  }
  
  async findByLastFilaId(lastFilaId: string): Promise<Client[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999); 
    
    return await this.clientRepository.find({
      where: {
        lastFilaId: lastFilaId,
        entryTime: Between(today, tomorrow),
      },
    });
  }

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
