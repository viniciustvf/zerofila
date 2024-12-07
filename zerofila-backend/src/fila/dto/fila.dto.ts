import { Empresa } from '@/empresa/models/empresa.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class FilaDto {
  @ApiProperty({
    description: 'Nome da fila',
    example: 'Fila de Atendimento',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Número máximo de pessoas na fila',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  max: number;

  @ApiProperty({
    description: 'URL da fila para acesso',
    example: 'http://example.com/fila',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  url: string;

  @ApiProperty({
    description: 'Status da fila Ativo = True ou Inativo = False',
  })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: 'ID da empresa associada à fila',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  empresaId: number;
}
