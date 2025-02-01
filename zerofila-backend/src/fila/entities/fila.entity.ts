import { Client } from "@/client/models/client.model";
import { Empresa } from "@/empresa/models/empresa.model";

export class Fila {
    constructor(
      public id: string,
      public name: string,
      public max: Number,
      public url: string,
      public status: boolean,
      public empresa: Empresa,
      public clients: Client[],
      public calledClient: Client
    ) {}
  }