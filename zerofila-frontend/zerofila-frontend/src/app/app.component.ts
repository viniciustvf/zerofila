import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, NgxMaskDirective, NgxMaskPipe, CommonModule],
  styleUrl: './app.component.scss',
  template: `
    <div class="menu">
      <!-- Ícones de Voltar e Menu ficam à esquerda -->
      <div class="menu-left">
        <div *ngIf="showBackIcon" class="back-icon" (click)="voltar()" aria-label="Voltar">          
          <img src="back.png" alt="Voltar">
        </div>
        <div *ngIf="showMenuIcon" class="menu-icon" aria-label="Abrir Menu">&#9776;</div>
      </div>

      <!-- Logo fica à direita -->
      <div class="logo">
        <img src="Z.png" alt="Logo Zero Fila">
      </div>
    </div>
    <router-outlet></router-outlet>
    <p-toast></p-toast> <!-- Componente de Toast do PrimeNG -->
  `,
})
export class AppComponent {
  title = 'zerofila-frontend';

  showMenuIcon: boolean = false;
  showBackIcon: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenuIcon = event.url === '/';
        this.showBackIcon = event.url !== '/';
      }
    });
  }

  voltar(): void {
    window.history.back();
  }
}