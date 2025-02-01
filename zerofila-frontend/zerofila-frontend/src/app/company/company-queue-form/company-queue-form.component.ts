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
  
  queueName: string = '';
  max: number = 0;
  empresaId: number | null = null;

  submitted: boolean = false;

  constructor(private queueService: QueueService) {}

  get queueNameValid(): boolean {
    return this.queueName.trim().length > 0;
  }

  get maxValid(): boolean {
    return this.max !== null && this.max > 0;
  }

  ngOnInit(): void {
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
      const fila: Fila = {
        name: this.queueName.trim(),
        max: this.max,
        url: 'example.com.br', 
        status: true,
        empresaId: this.empresaId,
      };

      this.queueService.criaFila(fila).subscribe({
        next: (response) => {
          console.log('Fila cadastrada com sucesso:');
          alert('Fila cadastrada com sucesso!');
          this.resetForm();
        },
        error: (error) => {
          console.error('Erro ao cadastrar fila:', error);
          alert('Erro ao cadastrar fila.');
        },
      });
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
