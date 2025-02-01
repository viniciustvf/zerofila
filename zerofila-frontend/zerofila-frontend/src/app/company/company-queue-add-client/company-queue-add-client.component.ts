import { ChangeDetectorRef, Component } from '@angular/core';
import { Client } from '../../models/client.interface';
import { ActivatedRoute } from '@angular/router';
import { FilaSocketService } from '../../services/fila-socket.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-company-queue-add-client',
  standalone: true,
  imports: [FormsModule,
    CalendarModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DropdownModule,
    InputNumberModule,
    CardModule,
    InputTextModule,
    CommonModule,],
  templateUrl: './company-queue-add-client.component.html',
  styleUrl: './company-queue-add-client.component.scss'
})
export class CompanyQueueAddClientComponent {
  
  clientName: string = '';

  private readonly URL = 'http://localhost:4000/ws';

  showForm = true;

  queueId: string | null = null;
  clients: Client[] = [];

  constructor(
    private filaSocketService: FilaSocketService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.queueId = params.get('id');
    });

    this.filaSocketService.listenForQueueUpdate().subscribe((sortedClients) => {
      if (sortedClients) {
        console.log('Clientes ordenados:', sortedClients);
        this.clients = sortedClients;
      }
      this.cdr.detectChanges();
    });
  } 
  
  proximo(): void {
    if (!this.queueId) {
      alert('Erro: ID da fila não encontrado.');
      return;
    }

    if(this.clientName === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, insira um nome de fila válido.',
      });   
      return; 
    }
  
    this.filaSocketService.joinQueue({
      filaId: this.queueId,
      name: this.clientName,
    });
    this.filaSocketService.listenForErrors().subscribe((error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: error.message,
      });
    });
    window.history.back();
  }  

  cancel() {
    console.log("Fila cancelada");
  }
}
