import { Fila } from "@/fila/models/fila.model";

export class Client {
    constructor(
      public id: string,
      public name: string,
      public telefone: string,
      public fila: Fila,
    ) {}
  }