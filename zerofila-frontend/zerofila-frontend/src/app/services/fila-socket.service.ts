import { Injectable, Inject, PLATFORM_ID, inject, ApplicationRef } from '@angular/core';
import { first, Observable, of, shareReplay, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Client } from '../models/client.interface';

@Injectable({
  providedIn: 'root',
})
export class FilaSocketService {
  
  private socket!: Socket;

  constructor() {
    this.socket = io('http://localhost:4000', { autoConnect: false });
    inject(ApplicationRef).isStable.pipe(
      first((isStable) => isStable))
    .subscribe(() => { this.socket.connect() });

    this.socket.on('connect', () => {
      console.log('Conectado ao servidor WebSocket'); // Log de conexão
    });
    this.socket.on('connect_error', (error) => {
      console.error('Erro na conexão WebSocket:', error); // Log de erro de conexão
    });
  }

  joinQueue(clientData: { name: string; telefone?: string; filaId: string}): void {
    if (this.socket) {
      this.socket.emit('joinQueue', clientData);
      console.log(clientData)
    }
  }

  joinRoom(filaId: string): void {
    if (this.socket) {
      this.socket.emit('joinRoom', { filaId });
      console.log(`Entrando na sala da fila ${filaId}`);
    }
  }

  leaveQueue(data: { filaId: string; telefone: string }): void {
    this.socket.emit('leaveQueue', data);
  }

  viewQueue(filaId: { filaId: string}): Observable<void> {
    if (this.socket) {
      this.socket.emit('viewQueue', filaId);
    }
    return of(void 0);
  }

  callNextClient(filaId: string): void {
    if (this.socket) {
      this.socket.emit('callNextClient', filaId);
    }
  }

  listenForClientCalled(): Observable<Client> {
    return new Observable((observer) => {
      this.socket.on('clientCalled', (client: Client) => {
        observer.next(client);
      });
  
      return () => this.socket.off('clientCalled');
    });
  }

  listenForQueueUpdate(): Observable<Client[]> {
    return new Observable((observer) => {
      this.socket.on('queueUpdate', (sortedClients) => {
        observer.next(sortedClients);
      });
  
      return () => this.socket.off('queueUpdate');
    });
  }

  listenForQueueUrlUpdate(): Observable<{ url: string }> {
    return new Observable<{ url: string }>((observer) => {
      this.socket.on('queueUrlUpdated', (data: { url: string }) => {
        observer.next(data);
      });

      return () => this.socket.off('queueUrlUpdated');
    });
  }

  viewQrCode(): Observable<void> {
    if (this.socket) {
      this.socket.emit('queueUrlUpdated');
    }
    return of(void 0);
  }

  listenForErrors(): Observable<{ message: string }> {
    return new Observable<{ message: string }>((observer) => {
      const errorHandler = (errorData: { message: string }) => {
        console.error('Erro recebido do WebSocket:', errorData.message);
        observer.next(errorData);
        this.socket.off('error', errorHandler);
      };
  
      this.socket.on('error', errorHandler);
  
      return () => this.socket.off('error', errorHandler);
    });
  }
}