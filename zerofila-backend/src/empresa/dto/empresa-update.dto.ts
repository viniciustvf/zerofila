import { PartialType } from '@nestjs/swagger';
import { EmpresaDto } from './empresa.dto';

export class EmpresaUpdateDto extends PartialType(EmpresaDto) {}
