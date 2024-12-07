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
  //@ApiBearerAuth()
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
  }
  