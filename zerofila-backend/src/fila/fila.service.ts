import {
    Injectable,
    NotFoundException,
    HttpException,
    HttpStatus,
    BadRequestException,
    Inject,
  } from '@nestjs/common';
  import { UpdateResult } from 'typeorm';
  import { FILA_REPOSITORY_TOKEN } from './repositories/fila.repository.interface';
  import { Fila } from './models/fila.model';
  import { FilaTypeOrmRepository } from './repositories/implementations/fila.typeorm.repository';
  import { FilaDto } from './dto/fila.dto';
  import { FilaUpdateDto } from './dto/fila-update.dto';
  
  @Injectable()
  export class FilaService {
    constructor(
      @Inject(FILA_REPOSITORY_TOKEN)
      private readonly filaRepository: FilaTypeOrmRepository,
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
      try {
        return await this.filaRepository.create(filaDto);
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }
  
    public async updateFila(
      id: string,
      filaUpdateDto: FilaUpdateDto,
    ): Promise<UpdateResult> {
      try {
        return await this.filaRepository.updateFila(id, filaUpdateDto);
      } catch (err) {
        throw new BadRequestException('Fila not updated');
      }
    }
  
    public async deleteFila(id: string): Promise<void> {
      const fila = await this.findById(id);
      return await this.filaRepository.deleteFila(fila);
    }
  }
  