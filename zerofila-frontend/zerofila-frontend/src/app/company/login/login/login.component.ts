import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Login } from '../models/login.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public login = {} as Login;

  constructor(private authService: AuthService) {}

  public onLogin() {
   // this.authService.login(this.login.cpf);
  }
}