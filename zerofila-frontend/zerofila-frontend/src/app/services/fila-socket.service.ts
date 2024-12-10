import { Injectable, Inject, PLATFORM_ID, inject, ApplicationRef } from '@angular/core';
import { first, Observable, Subject } from 'rxjs';
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
  }

  joinQueue(clientData: { name: string; telefone: string; filaId: string}): void {
    if (this.socket) {
      this.socket.emit('joinQueue', clientData);
    }
  }

  listenForQueueUpdate(): Observable<Client[]> {
    return new Observable((observer) => {
      this.socket.on('queueUpdate', (sortedClients) => {
        observer.next(sortedClients);
      });
  
      return () => this.socket.off('queueUpdate');
    });
  }
}