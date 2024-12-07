import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(4000, { path: '/ws' })
export class FilaGateway {
  @WebSocketServer() server: Server;

  sendQueueUpdate(filaId: string, clients: any[]): void {
    this.server.to(filaId).emit('queueUpdate', clients);
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(@MessageBody() clientData: any, @ConnectedSocket() socket: Socket): void {
    const filaId = clientData.filaId;
    socket.join(filaId);  
    this.sendQueueUpdate(filaId, [clientData]); 
  }

  @SubscribeMessage('addClientToQueue')
  handleAddClient(@MessageBody() clientData: any, @ConnectedSocket() socket: Socket): void {
    const filaId = clientData.filaId;
    this.sendQueueUpdate(filaId, [clientData]); 
  }

  @SubscribeMessage('callNextClient')
  handleCallNextClient(@MessageBody() filaId: string): void {
    this.sendQueueUpdate(filaId, []); 
  }
}
