import { OmitType, PartialType } from '@nestjs/swagger';
import { EmpresaDto } from './empresa.dto';

export class EmpresaUpdateDto extends OmitType(PartialType(EmpresaDto), ['password'] as const) {}
