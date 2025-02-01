import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { QueueService } from '../services/queue.service';
import { Fila } from '../../models/fila.interface';
import { CommonModule } from '@angular/common';
import { Router } from 'express';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-queue-form',
  standalone: true,
  imports: [
    FormsModule,
    CalendarModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DropdownModule,
    InputNumberModule,
    CardModule,
    InputTextModule,
    CommonModule,
  ],
  templateUrl: './company-queue-form.component.html',
  styleUrls: ['./company-queue-form.component.scss'], // Correção do nome de propriedade
})
export class CompanyQueueFormComponent {
  
  filaId: string | null = null;
  queueName: string = '';
  max!: number;
  empresaId: number | null = null;

  submitted: boolean = false;

  constructor(private queueService: QueueService, private route: ActivatedRoute) {}

  get queueNameValid(): boolean {
    return this.queueName.trim().length > 0;
  }

  get maxValid(): boolean {
    return this.max !== null && this.max > 0;
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.queueName = params.get('name') || '';
      this.max = +(params.get('max') ?? 0);
      this.empresaId = params.get('empresaId') !== null ? +params.get('empresaId')! : null;
      this.filaId = params.get('id');
    });

    const empresaData = sessionStorage.getItem('empresa');

    if (empresaData) {
      try {
        const empresa = JSON.parse(empresaData); 
        this.empresaId = empresa.id;
      } catch (error) {
        console.error('Erro ao recuperar os dados da empresa:', error);
      }
    }
  }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.queueNameValid && this.maxValid && this.empresaId) {
      if (!this.queueName) {
        console.error('O nome da fila é obrigatório.');
        return;
      }
  
      if (this.filaId) {
        const filaUpdate: Partial<Fila> = {
          name: this.queueName.trim(),
          max: this.max,
          url: 'example.com.br',
          status: true,
          empresaId: this.empresaId,
        };
  
        this.queueService.updateFila(Number(this.filaId), filaUpdate).subscribe({
          next: () => {
            this.resetForm();
            window.history.back();
          },
          error: (error) => {
            console.error('Erro ao atualizar fila:', error);
          },
        });
      } else {
        const filaCreate: Fila = {
          id: undefined,
          name: this.queueName.trim(),
          max: this.max,
          url: 'example.com.br',
          status: true,
          empresaId: this.empresaId,
        };
  
        this.queueService.criaFila(filaCreate).subscribe({
          next: () => {
            this.resetForm();
            window.history.back();
          },
          error: (error) => {
            console.error('Erro ao cadastrar fila:', error);
          },
        });
      }
    } else {
      console.error('Por favor, corrija os erros antes de enviar.');
    }
  }  

  resetForm(): void {
    this.queueName = '';
    this.max = 0;
    this.submitted = false;
  }
}
