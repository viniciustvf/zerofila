import { PickType } from '@nestjs/swagger';
import { EmpresaDto } from '../../../empresa/dto/empresa.dto';

export class LoginDto extends PickType(EmpresaDto, [
  'email',
  'password',
] as const) {}
