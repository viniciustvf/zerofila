import { Empresa } from '@/empresa/models/empresa.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Fila } from '@/fila/models/fila.model';

@Entity()
export class Client {
  @ApiProperty({
    description: 'Identificador único do cliente',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João da silva',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Número de telefone',
    example: '48999072751',
    maxLength: 60,
  })
  @Column({ length: 60 })
  telefone: string;

  @ApiProperty({
    description: 'Fila associada à client',
    type: () => Fila,
  })
  @ManyToOne(() => Fila, { onDelete: 'CASCADE' })
  fila: Fila;
}