import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, NgxMaskDirective, NgxMaskPipe],
  template: `
    <router-outlet></router-outlet>
    <p-toast></p-toast> <!-- Componente de Toast do PrimeNG -->
  `,
})
export class AppComponent {
  title = 'zerofila-frontend';
}