import { MaxLength, IsNotEmpty, IsString, IsInt } from 'class-validator';

export class FilaDto {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsInt()
  max: number;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsInt()
  idEmpresa: number; 
}
