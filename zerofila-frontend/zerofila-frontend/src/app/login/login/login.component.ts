import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  //public person = {} as Person;

  constructor(private authService: AuthService) {}

  /*public onLogin() {
    this.authService.login(this.person.cpf);
  }*/
}
