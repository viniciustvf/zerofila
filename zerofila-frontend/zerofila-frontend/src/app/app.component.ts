import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToastModule,
    NgxMaskDirective,
    NgxMaskPipe,
    CommonModule,
    ConfirmDialogModule,
  ],
  providers: [ConfirmationService, MessageService],
  styleUrl: './app.component.scss',
  template: `
    <p-confirmDialog></p-confirmDialog>
    
    <div class="menu" *ngIf="showMenu">
      <!-- Ícones de Voltar e Menu ficam à esquerda -->
      <div class="menu-left">
        <div class="icon-wrapper">
          <div *ngIf="showBackIcon" class="back-icon" (click)="voltar()" aria-label="Voltar">          
            <img src="back.png" alt="Voltar">
          </div>
          <div *ngIf="showMenuIcon" class="menu-icon" (click)="confirmLogout()" aria-label="Sair">
            <img src="logout.png" style="width: 30px;" alt="Logout" />
          </div>
        </div>
      </div>

      <!-- Logo fica à direita -->
      <div class="logo">
        <img src="Z.png" alt="Logo Zero Fila">
      </div>
    </div>

    <router-outlet></router-outlet>
    <p-toast></p-toast>
  `,
})
export class AppComponent {
  title = 'zerofila-frontend';

  showMenuIcon: boolean = false;
  showBackIcon: boolean = false;
  showMenu: boolean = true;

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenuIcon = event.url === '/';
        this.showBackIcon = event.url !== '/';
        this.showMenu = event.url !== '/login' && event.url !== '/error' && !event.url.startsWith('/client-queue-form');
      }
    });
  }

  voltar(): void {
    window.history.back();
  }

  confirmLogout(): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja sair do sistema?',
      header: 'Confirmação de Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => this.logout(),
    });
  }

  logout(): void {
    this.storageService.removeItem('accessToken');
    this.storageService.removeItem('empresa');
    this.storageService.removeItem('refreshToken');

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }
}