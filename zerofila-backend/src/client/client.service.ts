import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Inject,
  } from '@nestjs/common';
  import { UpdateResult } from 'typeorm';
  import { CLIENT_REPOSITORY_TOKEN } from './repositories/client.repository.interface';
  import { Client } from './models/client.model';
  import { ClientTypeOrmRepository } from './repositories/implementations/client.typeorm.repository';
  import { ClientUpdateDto } from './dto/client-update.dto';
import { ClientDto } from './dto/client.dto';
import { FILA_REPOSITORY_TOKEN } from '@/fila/repositories/fila.repository.interface';
import { FilaTypeOrmRepository } from '@/fila/repositories/implementations/fila.typeorm.repository';
  
  @Injectable()
  export class ClientService {
    constructor(
      @Inject(CLIENT_REPOSITORY_TOKEN)
      private readonly clientRepository: ClientTypeOrmRepository,

      @Inject(FILA_REPOSITORY_TOKEN)
      private readonly filaRepository: FilaTypeOrmRepository,
    ) {}
  
    public async findAll(): Promise<Client[]> {
      return await this.clientRepository.findAll();
    }
  
    public async findById(clientId: string): Promise<Client> {
      const client = await this.clientRepository.findById(clientId);
  
      if (!client) {
        throw new NotFoundException(`Client #${clientId} not found`);
      }
  
      return client;
    }
  
    public async createClient(clientDto: ClientDto): Promise<Client> {
      const fila = await this.filaRepository.findById(clientDto.filaId.toString());
  
      if (!fila) {
        throw new NotFoundException(`Fila com ID ${clientDto.filaId} não encontrada.`);
      }
  
      const client = new Client();
      client.name = clientDto.name;
      client.telefone = clientDto.telefone;
      client.fila = fila;
  
      return this.clientRepository.create(client);
    }
  
    public async updateClient(
      id: string,
      clientUpdateDto: ClientUpdateDto,
    ): Promise<UpdateResult> {
      const fila = await this.filaRepository.findById(clientUpdateDto?.filaId.toString());

      const client = new Client();
      client.name = clientUpdateDto.name;
      client.telefone = clientUpdateDto.telefone;
      client.fila = fila;

      try {
        return await this.clientRepository.updateClient(id, client);
      } catch (err) {
        throw new BadRequestException('Client not updated');
      }
    }
  
    public async deleteClient(id: string): Promise<void> {
      const client = await this.findById(id);
      return await this.clientRepository.deleteClient(client);
    }

    public async findClientsByEmpresaAndDate(
      empresaId: string,
      startDate: string,
      endDate: string
    ): Promise<Client[]> {
      return await this.clientRepository.findClientsByEmpresaAndDate(empresaId, startDate, endDate);
    }
  }
  