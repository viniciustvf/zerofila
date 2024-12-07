import { FilaUpdateDto } from "../dto/fila-update.dto";
import { Fila } from "../models/fila.model";


export interface FilaRepository {
  findAll(): void;
  findById(filaId: string): void;
  create(fila: Fila): void;
  updateFila(filaId: string, filaUpdateDto: FilaUpdateDto): void;
  deleteFila(id: string): void;
}

export const FILA_REPOSITORY_TOKEN = 'fila-repository-token';
