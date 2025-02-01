import { Client } from '@/client/models/client.model';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { FILA_REPOSITORY_TOKEN } from './repositories/fila.repository.interface';
import { FilaTypeOrmRepository } from './repositories/implementations/fila.typeorm.repository';
import { CLIENT_REPOSITORY_TOKEN } from '@/client/repositories/client.repository.interface';
import { ClientTypeOrmRepository } from '@/client/repositories/implementations/client.typeorm.repository';
import { Fila } from './models/fila.model';

@WebSocketGateway(4000, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class FilaGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(FILA_REPOSITORY_TOKEN)
    private readonly filaRepository: FilaTypeOrmRepository,

    @Inject(CLIENT_REPOSITORY_TOKEN)
    private readonly clientRepository: ClientTypeOrmRepository,
  ) {}

  private async sendQueueUpdate(fila: Fila): Promise<void> {
    try {
      if (!fila) return;

      const sortedClients: Client[] = fila.clients.sort((a, b) => a.position - b.position);
      this.server.to(fila.id.toString()).emit('queueUpdate', sortedClients);
    } catch (error) {
      console.error('Erro ao enviar atualização da fila:', error);
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: { filaId: string }): void {
    client.join(payload.filaId);
    client.emit('joinedRoom', `Você entrou na sala da fila ${payload.filaId}`);
    console.log(`Cliente ${client.id} entrou na sala da fila ${payload.filaId}`);
  }

  @SubscribeMessage('leaveQueue')
  async leaveQueue(
    @MessageBody() data: { filaId: string; telefone: string },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    const { filaId, telefone } = data;

    try {
      const fila = await this.filaRepository.findByIdWithRelations(filaId);
      
      if (!fila || !fila.clients || fila.clients.length === 0) {
        socket.emit('error', { message: 'Fila não encontrada ou vazia' });
        return;
      }

      const clientIndex = fila.clients.findIndex(client => client.telefone === telefone);

      if (clientIndex === -1) {
        socket.emit('error', { message: 'Cliente não encontrado na fila' });
        return;
      }

      const removedClient = fila.clients[clientIndex];
      removedClient.fila = null; 

      await this.clientRepository.create(removedClient);

      fila.clients.splice(clientIndex, 1);
      fila.clients.forEach((client, index) => {
        client.position = index + 1;
      });

      await Promise.all(fila.clients.map(client => this.clientRepository.create(client)));
      await this.filaRepository.create(fila);

      this.sendQueueUpdate(fila);

      socket.emit('success', { message: 'Você saiu da fila com sucesso' });

    } catch (error) {
      console.error('Erro ao remover cliente da fila:', error);
      socket.emit('error', { message: 'Erro ao processar a solicitação' });
    }
  }

  @SubscribeMessage('joinQueue')
  async joinQueue(
    @MessageBody() clientData: { filaId: string; name: string; telefone: string },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    const { filaId, name, telefone } = clientData;
    try {
      const fila = await this.filaRepository.findByIdWithRelations(filaId);
      if (!fila) {
        socket.emit('error', { message: 'Fila não encontrada' });
        return;
      }

      if (fila.clients.length >= fila.max) {
        console.warn(`Fila ${filaId} está cheia. Capacidade máxima: ${fila.max} pessoas.`);
        socket.emit('error', { message: 'Fila está cheia. Aguarde disponibilidade.' });
        return;
      }

      const position = fila.clients.length + 1;
  
      const client = new Client();
      client.name = name;
      client.telefone = telefone;
      client.fila = fila;
      client.position = position;
      client.lastFilaId = fila.id.toString();
      client.entryTime = new Date();
  
      await this.clientRepository.create(client);
  
      const updatedFila = await this.filaRepository.findByIdWithRelations(filaId);
  
      socket.join(filaId);
  
      this.sendQueueUpdate(updatedFila);
    } catch (error) {
      console.error('Erro ao adicionar cliente à fila:', error);
      socket.emit('error', { message: 'Erro ao processar sua solicitação' });
    }
  }

  @SubscribeMessage('viewQueue')
  async viewQueue(
    @MessageBody() data: { filaId: string },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    const { filaId } = data;
    try {
      const fila = await this.filaRepository.findByIdWithRelations(filaId);
      if (!fila) {
        socket.emit('error', { message: 'Fila não encontrada' });
        return;
      }
      socket.join(filaId);
      await this.sendQueueUpdate(fila);
    } catch (error) {
      console.error('Erro ao visualizar a fila:', error);
      socket.emit('error', { message: 'Erro ao processar sua solicitação' });
    }
  }

  @SubscribeMessage('callNextClient')
  async handleCallNextClient(@MessageBody() filaId: string): Promise<void> {
    try {
      const fila = await this.filaRepository.findByIdWithRelations(filaId);
  
      if (!fila || !fila.clients || fila.clients.length === 0) {
        return;
      }
  
      const calledClient = fila.clients.shift();
  
      if (calledClient) {
        calledClient.exitTime = new Date();
        fila.calledClient = calledClient;
        calledClient.fila = null;
        await this.clientRepository.create(calledClient);
      }
  
      await Promise.all(
        fila.clients.map((client, index) => {
          client.position = index + 1;
          return this.clientRepository.create(client); 
        })
      );
  
      await this.filaRepository.create(fila);
  
      this.server.to(filaId).emit('clientCalled', calledClient);
  
      this.sendQueueUpdate(fila);
    } catch (error) {
      console.error('Erro ao adicionar cliente à fila:', error);
    }
  }

  @SubscribeMessage('queueUrlUpdated')
  async notifyQueueUrlUpdate(filaId: string, updatedUrl: string): Promise<void> {
    try {      
      this.server.to(filaId).emit('queueUrlUpdated', { filaId, url: updatedUrl });
    } catch (error) {
      console.error(`Erro ao emitir evento:`, error);
    }
  }  
}