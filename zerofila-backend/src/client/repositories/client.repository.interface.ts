import { ClientUpdateDto } from "../dto/client-update.dto";
import { Client } from "../models/client.model";


export interface ClientRepository {
  findAll(): void;
  findById(clientId: string): void;
  findByLastFilaId(lastFilaId: string): Promise<Client[]>;
  create(client: Client): void;
  updateClient(clientId: string, clientUpdateDto: ClientUpdateDto): void;
  deleteClient(id: string): void;
}

export const CLIENT_REPOSITORY_TOKEN = 'client-repository-token';
