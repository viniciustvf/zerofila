import { Empresa } from '@/empresa/models/empresa.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Fila {
  @ApiProperty({
    description: 'Identificador único da fila',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nome da fila',
    example: 'Fila de Atendimento',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Número máximo de pessoas permitidas na fila',
    example: 100,
  })
  @Column()
  max: number;

  @ApiProperty({
    description: 'URL associada à fila para acesso',
    example: 'http://example.com/fila',
    maxLength: 60,
  })
  @Column({ length: 60 })
  url: string;

  @ApiProperty({
    description: 'Status da fila Ativo = True ou Inativo = False',
  })
  @Column()
  status: boolean;

  @ApiProperty({
    description: 'Empresa associada à fila',
    type: () => Empresa, // Indica o tipo relacionado
  })
  @ManyToOne(() => Empresa, { onDelete: 'CASCADE' })
  empresa: Empresa;
}