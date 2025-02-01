import { Component } from '@angular/core';
import { Fila } from '../../models/fila.interface';
import { CommonModule } from '@angular/common';
import { QueueService } from '../services/queue.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-queue-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-queue-list.component.html',
  styleUrl: './company-queue-list.component.scss'
})
export class CompanyQueueListComponent {
  
  filas: Fila[] = [];
  erro: string = '';

  constructor(private queueService: QueueService, private router: Router) { }

  ngOnInit(): void {
    this.carregarFilas();
  }

  carregarFilas(): void {
    this.queueService.buscaTodasFilas().subscribe(
      (dados) => {
        this.filas = dados;
      },
      (erro) => {
        this.erro = 'Erro ao carregar as filas!';
        console.error(erro);
      }
    );
  }

  verDetalhes(fila: Fila): void {
    this.router.navigate(['/company-queue'], {
      queryParams: {
        id: fila.id,
      }
    });
  }

  adicionarFila(): void {
    this.router.navigate(['/company-queue-form']);
  }

  abrirQrCode(fila: Fila): void {
    this.router.navigate(['/company-queue-qrcode'], {
      queryParams: {
        id: fila.id,
      }
    });
  }
}
