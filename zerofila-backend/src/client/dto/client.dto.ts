import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class ClientDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João da silva',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Número de telefone'
  })
  @IsString()
  telefone: string;

  @ApiProperty({
    description: 'ID da fila',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  filaId: number;

  @IsNumber()
  position: number;
}
