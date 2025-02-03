import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { StorageService } from '../../services/storage.service';
import { QueueService } from '../services/queue.service';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-company-perfil-form',
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
    MessagesModule,
  ],
  templateUrl: './company-perfil-form.component.html',
  styleUrl: './company-perfil-form.component.scss',
})
export class CompanyPerfilFormComponent implements OnInit {
  empresa: any = {
    id: null,
    name: '',
    username: '',
    email: '',
  };

  empresaOriginal: any = {};

  submitted: boolean = false;

  constructor(
    private queueService: QueueService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarEmpresa();
  }

  carregarEmpresa(): void {
    const empresaData = this.storageService.getItem('empresa');

    if (empresaData) {
      try {
        const empresaArmazenada = JSON.parse(empresaData);
        const empresaId = empresaArmazenada.id;

        if (!empresaId) {
          console.error('ID da empresa não encontrado no sessionStorage.');
          return;
        }

        this.queueService.findEmpresaById(empresaId).subscribe({
          next: (empresaInfo) => {
            this.empresa = empresaInfo;
            this.empresaOriginal = { ...empresaInfo };
            console.log('Dados da empresa carregados:', this.empresa);
          },
          error: (error) => {
            console.error('Erro ao buscar dados da empresa:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro!',
              detail: 'Falha ao carregar dados da empresa!',
            });
          },
        });
      } catch (error) {
        console.error('Erro ao recuperar os dados da empresa:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro!',
          detail: 'Erro ao recuperar empresa.',
        });
      }
    } else {
      console.error('Nenhuma empresa encontrada no sessionStorage.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção!',
        detail: 'Nenhuma empresa encontrada!',
      });
    }
  }

  get empresaValida(): boolean {
    return (
      this.empresa.name.trim().length > 0 &&
      this.empresa.username.trim().length > 0 &&
      this.empresa.email.trim().length > 0
    );
  }

  empresaModificada(): boolean {
    return (
      this.empresa.name !== this.empresaOriginal.name ||
      this.empresa.username !== this.empresaOriginal.username ||
      this.empresa.email !== this.empresaOriginal.email
    );
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.empresaModificada()) {
      this.messageService.add({
        severity: 'info',
        summary: 'Nenhuma alteração!',
        detail: 'Os dados permanecem os mesmos. Nenhuma atualização necessária.',
      });
      return;
    }

    if (this.empresaValida && this.empresa.id) {
      this.queueService.updateEmpresa(this.empresa.id, this.empresa).subscribe({
        next: () => {
          this.storageService.setItem('empresa', JSON.stringify(this.empresa));
          this.empresaOriginal = { ...this.empresa };
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso!',
            detail: 'Os dados da empresa foram salvos com sucesso!',
          });
        },
        error: (error: any) => {
          console.error('Erro ao atualizar empresa:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro!',
            detail: 'Falha ao atualizar os dados da empresa!',
          });
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção!',
        detail: 'Preencha todos os campos corretamente!',
      });
    }
  }
}