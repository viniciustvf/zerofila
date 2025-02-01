import { Component, ChangeDetectorRef, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QueueService } from '../services/queue.service';
import { FilaSocketService } from '../../services/fila-socket.service';
import QRCode from 'qrcode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-queue-qrcode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-queue-qrcode.component.html',
  styleUrl: './company-queue-qrcode.component.scss'
})
export class CompanyQueueQrcodeComponent implements OnInit {

  queueId: string | null = null;
  url!: string;
  qrCodeSize: number = 800;
  copied: boolean = false;

  @ViewChild('qrcodeContainer', { static: false }) qrcodeContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private queueService: QueueService,
    private filaSocketService: FilaSocketService,
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.queueId = params.get('id');
  
      if (this.queueId) {
        this.filaSocketService.joinRoom(this.queueId);
      } else {
        console.error('Queue ID não encontrado.');
      }
    });
  }
  

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      console.warn('ngAfterViewInit skipped: Not running in a browser environment.');
      return;
    }

    if (!this.queueId) {
      console.error('Queue ID não encontrado.');
      return;
    }

    this.fetchInitialQueueUrl(this.queueId);

    this.filaSocketService.listenForQueueUrlUpdate().subscribe((data) => {
      console.log('Evento recebido no frontend:', data);
      if (data.url !== this.url) {
        this.url = data.url;
        this.generateQRCode(this.url);
        this.cdr.detectChanges();
      }
    });

    this.filaSocketService.viewQrCode();
  }
  

  private fetchInitialQueueUrl(queueId: string): void {
    this.queueService.findById(queueId).subscribe(
      (queue: { url: string; }) => {
        this.url = queue.url;
        this.generateQRCode(this.url);
        this.cdr.detectChanges();
      },
      (error: any) => {
        console.error('Erro ao buscar a fila:', error);
      }
    );
  }

  private generateQRCode(data: string): void {
    if (typeof window === 'undefined') {
      console.warn('QRCode generation skipped: Not running in a browser environment.');
      return;
    }

    const container = this.qrcodeContainer?.nativeElement;
    if (!container) {
      console.error('Erro: o container para o QR Code não foi encontrado.');
      return;
    }
    
    container.innerHTML = '';
    const absoluteUrl = new URL(data, window.location.origin).toString();

    QRCode.toCanvas(absoluteUrl, {
      width: this.qrCodeSize,
      errorCorrectionLevel: 'M',
    })
      .then((canvas: HTMLCanvasElement) => {
        container.appendChild(canvas);
      })
      .catch((error: any) => {
        console.error('Erro ao gerar o QR Code:', error);
      });
  }

  copyToClipboard(): void {
    if (!this.url) {
      console.error('Nenhuma URL disponível para copiar.');
      return;
    }

    const absoluteUrl = new URL(this.url, window.location.origin).toString();
    navigator.clipboard.writeText(absoluteUrl).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 2000); // Oculta a mensagem após 2 segundos
    }).catch((error) => {
      console.error('Erro ao copiar a URL:', error);
    });
  }
}
