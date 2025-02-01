import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Fila } from '../../models/fila.interface';
import { Client } from '../../models/client.interface';
import * as crypto from 'crypto';
import { QueueService } from '../../company/services/queue.service';
import { FilaSocketService } from '../../services/fila-socket.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { switchMap } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-client-form',
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
    FormsModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './client-queue-form.component.html',
  styleUrls: ['./client-queue-form.component.scss'],
})
export class ClientQueueFormComponent implements OnInit {
  clientData = {
    name: '',
    telefone: '',
  };

  estimatedTime: number = 0;

  phoneError = false;

  hasError: boolean = false;

  calledClient!: Client | undefined;

  queueId: string | null = null;
  hash: string | null = null;

  fila!: Fila;

  clients: Client[] = [];

  showForm = true;
  errorMessage: string = '';

  constructor(
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private queueService: QueueService,
    private filaSocketService: FilaSocketService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (this.storageService.getItem('clienteFila')) {
      this.storageService.removeItem('clienteFila');
    }
  
    this.route.queryParamMap.subscribe((params) => {
      this.queueId = params.get('id');
      this.hash = params.get('hash');
  
      if (!this.queueId || !this.hash) {
        this.redirectToError();
        console.log('SEM HASH OU SEM ID FILA');
        return;
      }
  
      this.queueService.validateHash(this.hash).subscribe(
        (response) => {
          if (!response.isValid) {
            console.log('RESPONSE INVÁLIDA');
            this.redirectToError();
            return;
          }
  
          if (this.queueId) {
            this.queueService.findById(this.queueId.toString()).subscribe((fila) => {
              this.fila = fila;
  
              if (fila.calledClient) {
                this.calledClient = fila.calledClient;
              }
  
              this.fetchEstimatedTime();
  
              if (this.queueId) {
                this.filaSocketService
                  .viewQueue({ filaId: this.queueId })
                  .pipe(switchMap(() => this.filaSocketService.listenForQueueUpdate()))
                  .subscribe((sortedClients: Client[]) => {
                    if (sortedClients) {
                      console.log('Clientes ordenados:', sortedClients);
                      this.clients = sortedClients;
                      this.fetchEstimatedTime();
                    }
                    this.cdr.detectChanges();
                  });
  
                this.filaSocketService.listenForClientCalled().subscribe((client) => {
                  if (client) {
                    this.calledClient = client;
                    this.fetchEstimatedTime();
                  }
                  this.cdr.detectChanges();
                });
  
                this.filaSocketService.listenForQueueUpdate().subscribe((sortedClients) => {
                  if (sortedClients) {
                    this.clients = sortedClients;
                    this.fetchEstimatedTime();
                  }
                  this.cdr.detectChanges();
                });
              }
            });
          }
        },
        (error) => {
          console.log('Erro ao validar hash:', error);
          this.redirectToError();
        }
      );
    });
  }

  private redirectToError(): void {
    this.router.navigate(['/error'], { replaceUrl: true });
    return;
  }

  proximo(): void {
    if (this.clientData.telefone.length !== 11) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, insira um número de telefone válido.',
      });
      return;
    }

    if (this.clientData.name.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, insira um nome válido.',
      });
      return;
    }

    if (!this.queueId) {
      alert('Erro: ID da fila não encontrado.');
      return;
    }

    this.queueService.checkClientInQueue(this.clientData.telefone, this.queueId).subscribe((response) => {
      if (response.exists) {
        console.log('Cliente já está na fila:', response.client);

        this.storageService.setItem(
          'clienteFila',
          JSON.stringify({ telefone: this.clientData.telefone, queueId: this.queueId })
        );

        this.messageService.add({
          severity: 'info',
          summary: 'Aviso',
          detail: 'Você já está na fila. Aguarde ser chamado!',
        });

        this.showForm = false;
      } else {
        console.log('Cliente adicionado à fila:', this.clientData);

        if (this.queueId) {
          this.filaSocketService.joinQueue({
            filaId: this.queueId,
            ...this.clientData,
          });

          this.hasError = false;

          this.filaSocketService.listenForErrors().subscribe((error) => {
            this.hasError = true;
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: error.message,
            });
          });

          this.storageService.setItem(
            'clienteFila',
            JSON.stringify({ telefone: this.clientData.telefone, queueId: this.queueId })
          );

          setTimeout(() => {
            if (!this.hasError) {
              this.showForm = false;
            }
          }, 100);
        }
      }

      this.cdr.detectChanges();
    });
  }

  confirmCancel() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja sair da fila?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.cancel();
      },
      reject: () => {
        console.log('Ação cancelada.');
      },
    });
  }

  cancel(): void {
    const storedClient = this.storageService.getItem('clienteFila');

    if (storedClient) {
      const client = JSON.parse(storedClient);

      if (client.queueId && client.telefone) {
        this.filaSocketService.leaveQueue({
          filaId: client.queueId,
          telefone: client.telefone,
        });

        this.storageService.removeItem('clienteFila');

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Você saiu da fila com sucesso.',
        });

        this.showForm = true;
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhum cliente encontrado na fila para cancelar.',
      });
    }
  }

  fetchEstimatedTime(): void {
    if (!this.queueId) {
      return;
    }
  
    this.queueService.getEstimatedWaitTime(this.queueId).subscribe(
      (response) => {
        this.estimatedTime = response.estimatedTime;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erro ao obter tempo estimado:', error);
      }
    );
  }

  getFormattedEstimatedTime(): string {
    if (this.estimatedTime < 1) {
      return `${Math.round(this.estimatedTime * 60)} segundos`;
    } else if (this.estimatedTime >= 60) {
      const hours = Math.floor(this.estimatedTime / 60);
      const minutes = Math.round(this.estimatedTime % 60);
  
      if (minutes === 0) {
        return `${hours} hora${hours > 1 ? 's' : ''}`;
      } else {
        return `${hours} hora${hours > 1 ? 's' : ''} e ${minutes} minuto${minutes > 1 ? 's' : ''}`;
      }
    } else {
      return `${Math.round(this.estimatedTime)} minuto${this.estimatedTime > 1 ? 's' : ''}`;
    }
  }
}