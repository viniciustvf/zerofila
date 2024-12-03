import { Empresa } from '@/empresa/models/empresa.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Fila {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  max: Number;

  @Column({ length: 60 })
  url: string;

  @ManyToOne(() => Empresa, { onDelete: 'CASCADE' })
  empresa: Empresa; 
}