import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public showMenuEmitter = new EventEmitter<boolean>();

  constructor(private router: Router, private http: HttpClient) {}

  public login(cpf: string): void {
    this.showMenuEmitter.emit(true);
    this.router.navigate(['']);
  }
}
