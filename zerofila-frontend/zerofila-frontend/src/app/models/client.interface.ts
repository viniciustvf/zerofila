export interface Client {
    id: number;
    
    name: string;

    position: number;

    telefone: string;

    fila: {
      id: number;
      name: string;
      max: number;
      url: string;
      status: boolean;
    };
  }
  