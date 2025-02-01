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
    example: 'João da Silva',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Número de telefone',
    example: '48999072751',
    maxLength: 60,
  })
  @Column({ length: 60, nullable: true })
  telefone: string;

  @ApiProperty({
    description: 'Fila associada ao cliente',
    type: () => Fila,
  })
  @ManyToOne(() => Fila, { onDelete: 'CASCADE' })
  fila: Fila;

  @ApiProperty({
    description: 'Posição do cliente na fila',
    example: 3,
  })
  @Column()
  position: number;
  
  @Column({ nullable: true })
  lastFilaId: string;

  @ApiProperty({
    description: 'Horário de entrada do cliente na fila',
    example: '2024-02-01T10:30:00.000Z',
  })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  entryTime: Date;

  @ApiProperty({
    description: 'Horário de saída do cliente da fila',
    example: '2024-02-01T10:45:00.000Z',
    nullable: true,
  })
  @Column({ type: 'timestamp', nullable: true })
  exitTime?: Date;

}