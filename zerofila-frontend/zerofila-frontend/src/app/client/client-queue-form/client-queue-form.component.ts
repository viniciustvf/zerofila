import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FilaSocketService } from '../../services/fila-socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Fila } from '../../models/fila.interface';
import { Client } from '../../models/client.interface';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [FormsModule, CalendarModule, NgxMaskDirective, NgxMaskPipe, DropdownModule, InputNumberModule, CardModule, InputTextModule, CommonModule],
  templateUrl: './client-queue-form.component.html',
  styleUrl: './client-queue-form.component.scss'
})
export class ClientQueueFormComponent {

  clientData = {
    name: '',
    telefone: '',
  };

  private readonly URL = 'http://localhost:4000/ws';

  showForm = true;

  queueId: string | null = null;
  clients: Client[] = [];

  constructor(
    private filaSocketService: FilaSocketService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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
  
    this.filaSocketService.joinQueue({
      filaId: this.queueId,
      ...this.clientData,
    });

    this.showForm = false;
  }  
}
