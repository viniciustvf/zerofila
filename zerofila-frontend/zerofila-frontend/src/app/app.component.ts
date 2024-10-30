import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, NgxMaskDirective, NgxMaskPipe],
  template: `
    <router-outlet/>
    <p-toast/>`,
})
export class AppComponent {
  title = 'zerofila-frontend';
}
