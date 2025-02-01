import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fila } from '../../models/fila.interface';
import { Client } from '../../models/client.interface';
import { StorageService } from '../../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private apiUrl = 'http://localhost:3000/api/fila';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  /**
   * Obtém os headers com o token JWT
   */
  private getHeaders(): HttpHeaders {
    const token = this.storageService.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Cria uma nova fila.
   * @param fila Objeto contendo os dados da fila
   * @returns Observable com a resposta do backend
   */
  criaFila(fila: Fila): Observable<Fila> {
    console.log(fila);
    return this.http.post<Fila>(this.apiUrl, fila, { headers: this.getHeaders() });
  }

  /**
   * Busca todas as filas.
   * @returns Observable com a lista de filas
   */
  buscaTodasFilas(): Observable<Fila[]> {
    const empresaData = sessionStorage.getItem('empresa');
  
    if (!empresaData) {
      console.error('Empresa não encontrada no sessionStorage.');
      return new Observable<Fila[]>((observer) => {
        observer.error('Empresa não encontrada.');
        observer.complete();
      });
    }
  
    try {
      const empresa = JSON.parse(empresaData);
      const empresaId = empresa.id;
  
      const params = new HttpParams().set('empresaId', empresaId);
  
      return this.http.get<Fila[]>(this.apiUrl, {
        headers: this.getHeaders(),
        params
      });
    } catch (error) {
      console.error('Erro ao parsear empresa do sessionStorage:', error);
      return new Observable<Fila[]>((observer) => {
        observer.error('Erro ao recuperar empresa.');
        observer.complete();
      });
    }
  }

  /**
   * Busca uma fila pelo ID.
   * @param filaId ID da fila a ser buscada
   * @returns Observable com os dados da fila encontrada
   */
  findById(filaId: string): Observable<Fila> {
    return this.http.get<Fila>(`${this.apiUrl}/findByIdWithRelations/${filaId}`, { headers: this.getHeaders() });
  }

  /**
   * Valida o hash de uma fila.
   * @param hash Hash a ser validado
   * @returns Observable com a resposta de validação do backend
   */
  validateHash(hash: string): Observable<{ isValid: boolean; message: string }> {
    const body = { hash };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<{ isValid: boolean; message: string }>(
      `${this.apiUrl}/validate-hash`,
      body,
      { headers } 
    );
  }

  /**
   * Verifica se um cliente já está na fila pelo número de telefone.
   * @param telefone Número de telefone do cliente
   * @param filaId ID da fila
   * @returns Observable indicando se o cliente já está na fila e os seus dados, se aplicável
   */
  checkClientInQueue(telefone: string, filaId: string): Observable<{ exists: boolean; client?: Client }> {
    const params = new HttpParams().set('telefone', telefone).set('filaId', filaId);
    return this.http.get<{ exists: boolean; client?: Client }>(
      `${this.apiUrl}/check-client`,
      { headers: this.getHeaders(), params }
    );
  }
}
