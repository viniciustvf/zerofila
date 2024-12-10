import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Inject,
  } from '@nestjs/common';
  import { UpdateResult } from 'typeorm';
  import { FILA_REPOSITORY_TOKEN } from './repositories/fila.repository.interface';
  import { Fila } from './models/fila.model';
  import { FilaTypeOrmRepository } from './repositories/implementations/fila.typeorm.repository';
  import { FilaUpdateDto } from './dto/fila-update.dto';
import { EMPRESA_REPOSITORY_TOKEN } from '@/empresa/repositories/empresa.repository.interface';
import { EmpresaTypeOrmRepository } from '@/empresa/repositories/implementations/empresa.typeorm.repository';
import { FilaDto } from './dto/fila.dto';
import { FilaGateway } from './fila.gateway';
import * as crypto from 'crypto';
  
  @Injectable()
  export class FilaService {
    constructor(
      @Inject(FILA_REPOSITORY_TOKEN)
      private readonly filaRepository: FilaTypeOrmRepository,

      @Inject(EMPRESA_REPOSITORY_TOKEN)
      private readonly empresaRepository: EmpresaTypeOrmRepository,

      private readonly filaGateway: FilaGateway
    ) {}
  
    public async findAll(): Promise<Fila[]> {
      return await this.filaRepository.findAll();
    }
  
    public async findById(filaId: string): Promise<Fila> {
      const fila = await this.filaRepository.findById(filaId);
  
      if (!fila) {
        throw new NotFoundException(`Fila #${filaId} not found`);
      }
  
      return fila;
    }
  
    public async createFila(filaDto: FilaDto): Promise<Fila> {
      const empresa = await this.empresaRepository.findById(filaDto.empresaId.toString());
  
      if (!empresa) {
        throw new NotFoundException(`Empresa com ID ${filaDto.empresaId} não encontrada.`);
      }
  
      const fila = new Fila();
      fila.name = filaDto.name;
      fila.max = filaDto.max;
      fila.url = filaDto.url;
      fila.status = filaDto.status;
      fila.empresa = empresa;

      const hash = crypto.randomBytes(16).toString('hex');
      fila.url = `/client-queue-form?id=${fila.id}&hash=${hash}`;

      const createdFila = await this.filaRepository.create(fila);

      const updatedHash = crypto.randomBytes(16).toString('hex');
      createdFila.url = `/client-queue-form?id=${createdFila.id}&hash=${updatedHash}`;

      await this.filaRepository.updateFila(createdFila.id.toString(), createdFila); 

      return this.filaRepository.findById(createdFila.id.toString());
    }
  
    public async updateFila(
      id: string,
      filaUpdateDto: FilaUpdateDto,
    ): Promise<UpdateResult> {
      const empresa = await this.empresaRepository.findById(filaUpdateDto?.empresaId.toString());

      const fila = new Fila();
      fila.name = filaUpdateDto.name;
      fila.max = filaUpdateDto.max;
      fila.url = filaUpdateDto.url;
      fila.empresa = empresa;

      try {
        return await this.filaRepository.updateFila(id, fila);
      } catch (err) {
        throw new BadRequestException('Fila not updated');
      }
    }
  
    public async deleteFila(id: string): Promise<void> {
      const fila = await this.findById(id);
      return await this.filaRepository.deleteFila(fila);
    }

    // addClientToQueue(filaId: string, clientData: any): void {
    //   this.filaGateway.sendQueueUpdate(filaId, [clientData]);
    // }
  
    // callNextClient(filaId: string): void {
    //   this.filaGateway.sendQueueUpdate(filaId, []);
    // }
  }
  