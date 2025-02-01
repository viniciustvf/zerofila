import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageService } from '../../../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:3000/api/auth/login';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService // Injeção do serviço seguro
  ) {}

  public login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ accessToken: string; refreshToken: string; empresa: any }>(
      this.apiUrl,
      { email, password },
      { headers }
    ).pipe(
      tap((response) => {
        if (response.accessToken) {
          this.storageService.setItem('accessToken', response.accessToken);
          this.storageService.setItem('refreshToken', response.refreshToken);
          this.storageService.setItem('empresa', JSON.stringify(response.empresa));
        }
      })
    );
  }

  public logout(): void {
    console.log('🚪 Logout efetuado');
    this.storageService.removeItem('accessToken');
    this.storageService.removeItem('refreshToken');
    this.storageService.removeItem('empresa');
    this.router.navigate(['/login']);
  }

  public getAccessToken(): string | null {
    return this.storageService.getItem('accessToken');
  }
}