import {
    Controller,
    Put,
    Get,
    Post,
    Body,
    Param,
    HttpStatus,
    NotFoundException,
    Delete,
    BadRequestException,
  } from '@nestjs/common';
  import { FilaService } from './fila.service';
  import { FilaUpdateDto } from './dto/fila-update.dto';
  import { FilaDto } from './dto/fila.dto';
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
  import { Fila } from './models/fila.model';
  
  @ApiTags('fila')
  //@ApiBearerAuth()
  @AuthGuard(AuthType.None)
  @Controller('fila')
  export class FilaController {
    constructor(private readonly filaService: FilaService) {}
  
    @Get()
    @ApiResponse({
      status: 200,
      description: 'Get all fila',
    })
    public async findAllFila(): Promise<Fila[]> {
      return this.filaService.findAll();
    }
  
    @Get('/:filaId')
    @ApiResponse({
      status: 200,
      description: 'Get a fila by id',
    })
    @ApiNotFoundResponse({ status: 400, description: 'fila not found' })
    public async findOneFila(
      @Param('filaId') filaId: string,
    ): Promise<Fila> {
      return this.filaService.findById(filaId);
    }
  
    @Post()
    @ApiCreatedResponse({
      status: 201,
      description: 'Fila created successfully',
    })
    @ApiBadRequestResponse({ status: 400, description: 'Invalid data' })
    public async createFila(
      @Body() filaDto: FilaDto,
    ): Promise<{ message: string; status: number }> {
      try {
        console.log(filaDto);
        await this.filaService.createFila(filaDto);
        return {
          message: 'Fila created successfully!',
          status: HttpStatus.CREATED,
        };
      } catch (err) {
        throw new BadRequestException(err, 'Error: Fila not created!');
      }
    }
  
    @Put('/:filaId')
    @ApiResponse({
      status: 200,
      description: 'Update a fila by id',
    })
    @ApiBadRequestResponse({ status: 400, description: 'fila not updated' })
    public async updateFila(
      @Param('filaId') filaId: string,
      @Body() filaUpdateDto: FilaUpdateDto,
    ): Promise<any> {
      try {
        await this.filaService.updateFila(filaId, filaUpdateDto);
  
        return {
          message: 'fila Updated successfully!',
          status: HttpStatus.OK,
        };
      } catch (err) {
        throw new BadRequestException(err, 'Error: fila not updated!');
      }
    }
  
    @Delete('/:filaId')
    @ApiResponse({
      status: 200,
      description: 'Delete a fila by id',
    })
    @ApiNoContentResponse({ status: 404, description: 'fila not deleted' })
    public async deleteFila(@Param('filaId') filaId: string): Promise<void> {
      await this.filaService.deleteFila(filaId);
    }
  }
  