import {
    Controller,
    Put,
    Get,
    Post,
    Body,
    Param,
    HttpStatus,
    Delete,
    BadRequestException,
  } from '@nestjs/common';
  import { ClientService } from './client.service';
  import { ClientUpdateDto } from './dto/client-update.dto';
  import { ClientDto } from './dto/client.dto';
  import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiResponse,
    ApiTags,
  } from '@nestjs/swagger';
  import { AuthGuard } from '../iam/login/decorators/auth-guard.decorator';
  import { AuthType } from '../iam/login/enums/auth-type.enum';
  import { Client } from './models/client.model';
  
  @ApiTags('client')
  @ApiBearerAuth()
  @AuthGuard(AuthType.None)
  @Controller('client')
  export class ClientController {
    constructor(private readonly clientService: ClientService) {}
  
    @Get()
    @ApiResponse({
      status: 200,
      description: 'Get all Client',
    })
    public async findAllClient(): Promise<Client[]> {
      return this.clientService.findAll();
    }
  
    @Get('/:clientId')
    @ApiResponse({
      status: 200,
      description: 'Get a Client by id',
    })
    @ApiNotFoundResponse({ status: 400, description: 'Client not found' })
    public async findOneClient(
      @Param('clientId') clientId: string,
    ): Promise<Client> {
      return this.clientService.findById(clientId);
    }
  
    @Post()
    @ApiCreatedResponse({
      status: 201,
      description: 'Client created successfully',
    })
    @ApiBadRequestResponse({ status: 400, description: 'Invalid data' })
    public async createClient(
      @Body() clientDto: ClientDto,
    ): Promise<{ message: string; status: number }> {
      try {
        console.log(clientDto);
        await this.clientService.createClient(clientDto);
        return {
          message: 'Client created successfully!',
          status: HttpStatus.CREATED,
        };
      } catch (err) {
        throw new BadRequestException(err, 'Error: Client not created!');
      }
    }
  
    @Put('/:clientId')
    @ApiResponse({
      status: 200,
      description: 'Update a Client by id',
    })
    @ApiBadRequestResponse({ status: 400, description: 'Client not updated' })
    public async updateClient(
      @Param('clientId') clientId: string,
      @Body() clientUpdateDto: ClientUpdateDto,
    ): Promise<any> {
      try {
        await this.clientService.updateClient(clientId, clientUpdateDto);
  
        return {
          message: 'Client Updated successfully!',
          status: HttpStatus.OK,
        };
      } catch (err) {
        throw new BadRequestException(err, 'Error: Client not updated!');
      }
    }
  
    @Delete('/:clientId')
    @ApiResponse({
      status: 200,
      description: 'Delete a Client by id',
    })
    @ApiNoContentResponse({ status: 404, description: 'Client not deleted' })
    public async deleteClient(@Param('clientId') clientId: string): Promise<void> {
      await this.clientService.deleteClient(clientId);
    }

    @Get('/empresa/:empresaId/clientes/:startDate/:endDate')
    public async findClientsByEmpresaAndDate(
      @Param('empresaId') empresaId: string,
      @Param('startDate') startDate: string,
      @Param('endDate') endDate: string
    ): Promise<Client[]> {
      try {
        const formattedStartDate = this.convertToMySQLFormat(startDate, true);
        const formattedEndDate = this.convertToMySQLFormat(endDate, false);
    
        console.log(`🔎 Buscando clientes da empresa ${empresaId} entre ${formattedStartDate} e ${formattedEndDate}`);
    
        const clientes = await this.clientService.findClientsByEmpresaAndDate(empresaId, formattedStartDate, formattedEndDate);
    
        console.log('✅ Clientes encontrados:', clientes);
    
        return clientes;
      } catch (err) {
        console.error('❌ Erro ao buscar clientes:', err);
        throw new BadRequestException('Erro ao buscar clientes!', err);
      }
    }
    
    /**
     * Converte uma data de `dd-MM-yyyy` para o formato MySQL `YYYY-MM-DD HH:MM:SS`
     * @param dateStr Data no formato `dd-MM-yyyy`
     * @param startOfDay Se `true`, retorna `00:00:00`, senão retorna `23:59:59`
     */
    private convertToMySQLFormat(dateStr: string, startOfDay: boolean): string {
      const [day, month, year] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
    
      const hours = startOfDay ? '00' : '23';
      const minutes = startOfDay ? '00' : '59';
      const seconds = startOfDay ? '00' : '59';
    
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${hours}:${minutes}:${seconds}`;
    }    
  }
  