import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fila } from '../../models/fila.interface';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  private apiUrl = 'http://localhost:3000/api/fila';

  constructor(private http: HttpClient) {}

  /**
   * Cria uma nova fila.
   * @param fila Objeto contendo os dados da fila
   * @returns Observable com a resposta do backend
   */
  criaFila(fila: Fila): Observable<Fila> {
    console.log(fila);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Fila>(this.apiUrl, fila, { headers });
  }

    /**
   * Busca todas as filas.
   * @returns Observable com a lista de filas
   */
    buscaTodasFilas(): Observable<Fila[]> {
      return this.http.get<Fila[]>(this.apiUrl);
    }
}
