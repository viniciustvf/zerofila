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

  @SubscribeMessage('joinQueue')
  async joinQueue(
    @MessageBody() clientData: { filaId: string; name: string; telefone: string },
    @ConnectedSocket() socket: Socket
  ): Promise<void> {
    const { filaId, name, telefone } = clientData;
    console.log('CHEGOUUUU.', clientData);

    try {
      const fila = await this.filaRepository.findById(filaId);
      const clients = await this.clientRepository.findByFilaId(Number(filaId));
      fila.clients = clients;
      console.log('FILAAA: ', fila);
      if (!fila) {
        socket.emit('error', { message: 'Fila não encontrada' });
        return;
      }

      const position = fila.clients.length + 1;

      const client = new Client();
      client.name = name;
      client.telefone = telefone;
      client.fila = fila;
      client.position = position;

      await this.clientRepository.create(client);

      socket.join(filaId);

      this.sendQueueUpdate(fila);

    } catch (error) {
      console.error('Erro ao adicionar cliente à fila:', error);
      socket.emit('error', { message: 'Erro ao processar sua solicitação' });
    }
  }

  // // Empresa adiciona cliente manualmente
  // @SubscribeMessage('addClientToQueue')
  // handleAddClient(@MessageBody() clientData: { filaId: string; name: string; phone: string }): void {
  //   const { filaId, name, phone } = clientData;

  //   // Adicionar cliente manualmente à fila
  //   const clients = this.filas.get(filaId) || [];
  //   const newClient: Client = { id: `${filaId}-${clients.length + 1}`, name, phone, position: clients.length + 1 };
  //   clients.push(newClient);
  //   this.filas.set(filaId, clients);

  //   // Enviar atualização da fila
  //   this.sendQueueUpdate(filaId);
  // }

  // // Empresa chama o próximo cliente
  // @SubscribeMessage('callNextClient')
  // handleCallNextClient(@MessageBody() filaId: string): void {
  //   const clients = this.filas.get(filaId);

  //   if (!clients || clients.length === 0) {
  //     return; // Nenhum cliente na fila
  //   }

  //   // Remover o cliente chamado
  //   const calledClient = clients.shift(); // Remove o primeiro da fila

  //   // Recalcular posições dos clientes restantes
  //   clients.forEach((client, index) => {
  //     client.position = index + 1;
  //   });

  //   this.filas.set(filaId, clients);

  //   // Enviar atualização da fila
  //   this.server.to(filaId).emit('clientCalled', calledClient); // Notificar quem foi chamado
  //   this.sendQueueUpdate(filaId); // Atualizar a fila para todos
  // }

  // // Cliente sai da fila
  // @SubscribeMessage('leaveQueue')
  // handleLeaveQueue(@MessageBody() filaId: string, @ConnectedSocket() socket: Socket): void {
  //   const clients = this.filas.get(filaId);

  //   if (!clients) {
  //     return;
  //   }

  //   // Remover cliente da fila
  //   const updatedClients = clients.filter((client) => client.id !== socket.id);

  //   // Recalcular posições
  //   updatedClients.forEach((client, index) => {
  //     client.position = index + 1;
  //   });

  //   this.filas.set(filaId, updatedClients);

  //   // Cliente sai da sala
  //   socket.leave(filaId);

  //   // Enviar atualização da fila
  //   this.sendQueueUpdate(filaId);
  // }
}