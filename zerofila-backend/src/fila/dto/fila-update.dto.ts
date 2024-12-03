import { PartialType } from '@nestjs/swagger';
import { FilaDto } from './fila.dto';

export class FilaUpdateDto extends PartialType(FilaDto) {}