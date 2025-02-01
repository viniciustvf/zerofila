import { Client } from "./client.interface";

export interface Fila {
    id?: number  

    name: string;
  
    max: number;
  
    url: string;

    status: boolean;
  
    empresaId: number;

    calledClient?: Client;

    qtdClients?: number;
  }
  