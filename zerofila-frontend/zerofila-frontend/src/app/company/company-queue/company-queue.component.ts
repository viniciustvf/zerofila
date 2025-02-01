import { ChangeDetectorRef, Component } from '@angular/core';
import { Client } from '../../models/client.interface';
import { FilaSocketService } from '../../services/fila-socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs';
import { QueueService } from '../services/queue.service';
import { Fila } from '../../models/fila.interface';
import { ClientService } from '../../client/services/client.service';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-company-queue',
  standalone: true,
  imports: [CommonModule,    
    FormsModule,
    CalendarModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DropdownModule,
    InputNumberModule,
    CardModule,
    InputTextModule,
    CommonModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './company-queue.component.html',
  styleUrl: './company-queue.component.scss'
})
export class CompanyQueueComponent {
  
  clientData = {
    name: '',
    telefone: '',
  };

  private readonly URL = 'http://localhost:4000/ws';

  filaId: string | null = null;
  
  clients: Client[] = [];
  
  fila: Fila = {
    id: 0,
    name: '',
    max: 0,
    url: '',
    status: false,
    empresaId: 0
  };

  calledClient!: Client;

  constructor(
    private filaSocketService: FilaSocketService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private queueService: QueueService,
    private clientService: ClientService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}
  
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.filaId = params.get('id');
  
      if (this.filaId) {
        this.queueService.findById(this.filaId.toString()).subscribe((fila) => {
          this.fila = fila;
          
          if (fila.calledClient) {
            this.calledClient = fila.calledClient
          }
        });
  
        this.filaSocketService
          .viewQueue({ filaId: this.filaId })
          .pipe(switchMap(() => this.filaSocketService.listenForQueueUpdate()))
          .subscribe((sortedClients: Client[]) => {
            if (sortedClients) {
              this.clients = sortedClients;
            }
            this.cdr.detectChanges();
          });
  
        this.filaSocketService.listenForClientCalled().subscribe((client) => {
          this.calledClient = client;
          this.cdr.detectChanges();
        });
      } else {
        console.error('filaId não encontrado nos parâmetros da rota');
      }
    });
  }

  confirmCallNextClient() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja chamar o próximo cliente?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.callNextClient();
      },
      reject: () => {
        console.log('Ação cancelada.');
      },
    });
  }

  callNextClient() {
    if (this.filaId) {
      this.filaSocketService.callNextClient(this.filaId);
    }  
  }

  addClient() {
    this.router.navigate(['/company-queue-add-client'], {
      queryParams: {
        id: this.filaId,
      }
    });
  }
}
