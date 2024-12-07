import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class FilaSocketService {

  private socket: Socket;
  private serverUrl = 'http://127.0.0.1:3000/ws';

  constructor() {
    this.socket = io(this.serverUrl);
  }

  sendMessage(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  onMessage(event: string, callback: (data: any) => void): void {
    this.socket.on(event, callback);
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  reconnect(): void {
    this.socket.connect();
  }
}
