import { OmitType } from '@nestjs/swagger';
import { EmpresaDto } from './empresa.dto';

export class EmpresaProfileDto extends OmitType(EmpresaDto, ['password'] as const) {}
