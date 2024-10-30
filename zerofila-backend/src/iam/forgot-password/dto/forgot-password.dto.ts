import { PickType } from '@nestjs/swagger';
import { EmpresaDto } from '../../../empresa/dto/empresa.dto';

export class ForgotPasswordDto extends PickType(EmpresaDto, ['email'] as const) {}
