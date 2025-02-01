import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Login } from '../models/login.interface';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [    FormsModule,
    CalendarModule,
    NgxMaskDirective,
    NgxMaskPipe,
    DropdownModule,
    InputNumberModule,
    CardModule,
    InputTextModule,
    CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public login: Login = { email: '', password: '' };
  public errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  public onLogin() {
    if (this.login.email === '' || this.login.password === ''){
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Email ou senha inválidos.',
      });   
      return; 
    }
    
    this.authService.login(this.login.email, this.login.password)
      .pipe(
        tap(() => {
          console.log('LOGOU???!')
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          console.error('Erro no login:', err);
          this.errorMessage = 'Erro ao fazer login. Verifique suas credenciais!';
          return throwError(() => err);
        })
      )
      .subscribe();
  }
}