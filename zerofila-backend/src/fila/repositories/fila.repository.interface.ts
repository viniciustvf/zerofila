import { FilaUpdateDto } from "../dto/fila-update.dto";
import { FilaDto } from "../dto/fila.dto";


export interface FilaRepository {
  findAll(): void;
  findById(filaId: string): void;
  create(filaDto: FilaDto): void;
  updateFila(filaId: string, filaUpdateDto: FilaUpdateDto): void;
  deleteFila(id: string): void;
}

export const FILA_REPOSITORY_TOKEN = 'fila-repository-token';
