import {
    Injectable,
    NotFoundException,
    BadRequestException,
    Inject,
  } from '@nestjs/common';
  import { UpdateResult } from 'typeorm';
  import { FILA_REPOSITORY_TOKEN } from './repositories/fila.repository.interface';
  import { Fila } from './models/fila.model';
  import { FilaTypeOrmRepository } from './repositories/implementations/fila.typeorm.repository';
  import { FilaUpdateDto } from './dto/fila-update.dto';
import { EMPRESA_REPOSITORY_TOKEN } from '@/empresa/repositories/empresa.repository.interface';
import { EmpresaTypeOrmRepository } from '@/empresa/repositories/implementations/empresa.typeorm.repository';
import { FilaDto } from './dto/fila.dto';
import { FilaGateway } from './fila.gateway';
import * as crypto from 'crypto';
import { Cron } from '@nestjs/schedule';
import { Twilio } from 'twilio/lib';
import { Client } from '@/client/models/client.model';
import { ClientTypeOrmRepository } from '@/client/repositories/implementations/client.typeorm.repository';
import { CLIENT_REPOSITORY_TOKEN } from '@/client/repositories/client.repository.interface';
  
@Injectable()
export class FilaService {
    
  private twilioClient: Twilio;
  private readonly messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
  private notifiedClients = new Set<string>();

  constructor(
    @Inject(FILA_REPOSITORY_TOKEN)
    private readonly filaRepository: FilaTypeOrmRepository,

    @Inject(CLIENT_REPOSITORY_TOKEN)
    private readonly clientRepository: ClientTypeOrmRepository,

    @Inject(EMPRESA_REPOSITORY_TOKEN)
    private readonly empresaRepository: EmpresaTypeOrmRepository,

    private readonly filaGateway: FilaGateway
  ) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    //this.twilioClient = new Twilio(accountSid, authToken);
  }
  
  public async findAll(empresaId?: string): Promise<Fila[]> {
    return await this.filaRepository.findAllByEmpresaId(Number(empresaId));
  }
  
  public async findById(filaId: string): Promise<Fila> {
    const fila = await this.filaRepository.findById(filaId);

    if (!fila) {
      throw new NotFoundException(`Fila #${filaId} not found`);
    }

    return fila;
  }

  public async findByIdWithRelations(filaId: string): Promise<Fila> {
    const fila = await this.filaRepository.findByIdWithRelations(filaId);

    if (!fila) {
      throw new NotFoundException(`Fila #${filaId} not found`);
    }

    return fila;
  }
  
  public async createFila(filaDto: FilaDto): Promise<Fila> {
    const empresa = await this.empresaRepository.findById(filaDto.empresaId.toString());

    if (!empresa) {
      throw new NotFoundException(`Empresa com ID ${filaDto.empresaId} não encontrada.`);
    }

    const fila = new Fila();
    fila.name = filaDto.name;
    fila.max = filaDto.max;
    fila.url = filaDto.url;
    fila.status = filaDto.status;
    fila.empresa = empresa;


    const timestamp = Math.floor(Date.now() / 1000);
    const dataToHash = `${timestamp}`;
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
    
    const url = `&hash=${hash}:${timestamp}`;

    const createdFila = await this.filaRepository.create(fila);

    createdFila.url = `/client-queue-form?id=${createdFila.id}${url}`;

    await this.filaRepository.updateFila(createdFila.id.toString(), createdFila); 

    return this.filaRepository.findById(createdFila.id.toString());
  }

  public async validateHash(hash: string): Promise<boolean> {
    try {
      const [receivedHash, timestampStr] = hash.split(':'); 
      const timestamp = parseInt(timestampStr, 10);
  
      if (isNaN(timestamp)) {
        return false;
      }
  
      const currentTime = Math.floor(Date.now() / 1000);
      const maxAgeInSeconds = 5 * 60;
  
      if (Math.abs(currentTime - timestamp) > maxAgeInSeconds) {
        return false;
      }
  
      const dataToHash = `${timestamp}`;
      const recalculatedHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

      return receivedHash === recalculatedHash;
    } catch (error) {
      console.error('Error validating hash:', error);
      return false;
    }
  }

  @Cron('*/5 * * * * *')
  async generateAndUpdateHash(): Promise<void> {
    const timestamp = Math.floor(Date.now() / 1000);
    const dataToHash = `${timestamp}`;
    const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
    const newHash = `${hash}:${timestamp}`;


    const filas = await this.filaRepository.findAll();

    if (!filas || filas.length === 0) {
      console.log('Nenhuma fila encontrada para atualizar.');
      return;
    }

    let updatedUrl;
    for (const fila of filas) {
      updatedUrl = `/client-queue-form?id=${fila.id}&hash=${newHash}`;
      fila.url = updatedUrl;

      await this.filaRepository.updateFila(fila.id.toString(), fila);

      this.filaGateway.notifyQueueUrlUpdate(fila.id.toString(), updatedUrl);
    }
  }

  @Cron('*/10 * * * * *')
  async checkQueueAndNotify(): Promise<void> {
    console.log('🔍 Verificando a fila...');

    try {
      const filas = await this.filaRepository.findAll();

      if (!filas || filas.length === 0) {
        console.log('⚠ Nenhuma fila encontrada.');
        return;
      }

      for (const fila of filas) {
        const queue = await this.filaRepository.findByIdWithRelations(fila.id.toString());

        if (!queue || !queue.clients || queue.clients.length === 0) {
          console.log(`⚠ A fila "${fila.name}" não possui clientes.`);
          continue;
        }

        const nextInLine = queue.clients.find(cliente => cliente.position === 2);

        if (!nextInLine) {
          console.log(`⚠ Nenhum cliente na posição 2 da fila "${fila.name}".`);
          continue;
        }

        if (!nextInLine.telefone) {
          console.warn(`⚠ Cliente na posição 2 da fila "${fila.name}" não possui um telefone válido.`);
          continue;
        }

        if (!this.notifiedClients.has(nextInLine.telefone)) {
          try {
            //await this.sendSms('+55' + nextInLine.telefone, queue.empresa.name + ' Você é o próximo da fila ' + queue.name + '! Por favor, prepare-se.');
            this.notifiedClients.add(nextInLine.telefone);
            console.log(`✅ Mensagem enviada para ${nextInLine.telefone}.`);
          } catch (error) {
            console.error(`❌ Erro ao enviar mensagem para ${nextInLine.telefone}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro inesperado ao verificar as filas:', error);
    }
  }

  private async sendSms(to: string, body: string): Promise<void> {
    try {
      const message = await this.twilioClient.messages.create({
        body,
        messagingServiceSid: this.messagingServiceSid,
        to,
      });
      console.log(`Mensagem enviada com sucesso: SID ${message.sid}`);
    } catch (error) {
      console.error('Erro ao enviar mensagem SMS:' + error);
      throw error;
    }
  }
    
  public async updateFila(
    id: string,
    filaUpdateDto: FilaUpdateDto,
  ): Promise<UpdateResult> {
    const empresa = await this.empresaRepository.findById(filaUpdateDto?.empresaId.toString());

    const fila = new Fila();
    fila.name = filaUpdateDto.name;
    fila.max = filaUpdateDto.max;
    fila.url = filaUpdateDto.url;
    fila.empresa = empresa;

    try {
      return await this.filaRepository.updateFila(id, fila);
    } catch (err) {
      throw new BadRequestException('Fila not updated');
    }
  }

  public async deleteFila(id: string): Promise<void> {
    const fila = await this.findById(id);
    return await this.filaRepository.deleteFila(fila);
  }

  async findClientInQueue(telefone: string, filaId: string): Promise<Client | null> {
    try {
      if (!telefone || !filaId) {
        throw new BadRequestException('Telefone e Fila ID são obrigatórios.');
      }
  
      const fila = await this.filaRepository.findByIdWithRelations(filaId);
      if (!fila) {
        throw new NotFoundException(`Fila com ID ${filaId} não encontrada.`);
      }
  
      const client = fila.clients.find((c) => c.telefone === telefone);
      return client || null;
    } catch (error) {
      console.error('Erro ao buscar cliente na fila:', error);
      throw error;
    }
  }

  public async getEstimatedWaitTime(filaId: string): Promise<{ estimatedTime: number }> {
    // Buscar clientes que já foram atendidos e possuem exitTime válido
    const attendedClients = await this.clientRepository.findByLastFilaId(filaId);
    const validClients = attendedClients.filter(client => client.exitTime); // Filtra apenas clientes com exitTime
  
    if (validClients.length === 0) {
      console.warn(`Nenhum cliente atendido encontrado para fila ${filaId}.`);
      return { estimatedTime: 0 };
    }
  
    const totalServiceTime = validClients.reduce((sum, client) => {
      if (!client.entryTime || !client.exitTime) {
        console.warn(`Cliente ${client.id} tem horários inválidos: entryTime=${client.entryTime}, exitTime=${client.exitTime}`);
        return sum; // Ignora clientes sem horários válidos
      }
  
      // Garante que entryTime e exitTime sejam convertidos corretamente
      const entryTime = new Date(client.entryTime);
      const exitTime = new Date(client.exitTime);
  
      // Verifica se os valores são válidos
      if (isNaN(entryTime.getTime()) || isNaN(exitTime.getTime())) {
        console.error(`Erro ao converter datas para cliente ${client.id}: entryTime=${client.entryTime}, exitTime=${client.exitTime}`);
        return sum;
      }
  
      // Garante que exitTime seja sempre maior que entryTime
      if (exitTime <= entryTime) {
        console.error(`Erro: exitTime (${exitTime}) é menor ou igual a entryTime (${entryTime}) para cliente ${client.id}`);
        return sum;
      }
  
      // Calcula tempo de serviço em minutos
      const serviceTime = (exitTime.getTime() - entryTime.getTime()) / 60000; // Convertendo de ms para minutos
      console.log(`Cliente ${client.id}: Tempo de serviço calculado = ${serviceTime.toFixed(2)} minutos`);
  
      return sum + serviceTime;
    }, 0);
  
    if (totalServiceTime === 0) {
      console.warn(`Nenhum cliente teve um tempo de atendimento válido para calcular a média.`);
      return { estimatedTime: 0 };
    }
  
    // Calcula tempo médio por cliente corretamente
    const avgServiceTimePerClient = totalServiceTime / validClients.length;
    console.log(`Tempo médio por cliente: ${avgServiceTimePerClient.toFixed(2)} minutos`);
  
    // Buscar clientes atualmente na fila para estimar tempo de espera
    const fila = await this.filaRepository.findByIdWithRelations(filaId);
    if (!fila || !fila.clients) {
      return { estimatedTime: 0 };
    }
  
    // Calcula tempo estimado de espera com base no tempo médio de atendimento
    const estimatedTime = fila.clients.length * avgServiceTimePerClient;
  
    console.log(`Tempo estimado de espera para novos clientes: ${estimatedTime.toFixed(2)} minutos`);
  
    return { estimatedTime };
  }    
}
  