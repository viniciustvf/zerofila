import {
  Controller,
  Put,
  Get,
  Body,
  Param,
  HttpStatus,
  NotFoundException,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { EmpresaProfileDto } from './dto/empresa-profile.dto';
import { EmpresaUpdateDto } from './dto/empresa-update.dto';
import { AccountsEmpresa } from './interfaces/accounts-empresa.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard, Public } from '../iam/login/decorators/auth-guard.decorator';
import { AuthType } from '../iam/login/enums/auth-type.enum';

@ApiTags('empresa')
@ApiBearerAuth()
@AuthGuard(AuthType.Bearer)
@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all empresa',
  })
  public async findAllEmpresa(): Promise<AccountsEmpresa[]> {
    return this.empresaService.findAll();
  }

  @Get('/:empresaId')
  @ApiResponse({
    status: 200,
    description: 'Get a empresa by id',
  })
  @ApiNotFoundResponse({ status: 400, description: 'empresa not found' })
  public async findOneEmpresa(
    @Param('empresaId') empresaId: string,
  ): Promise<AccountsEmpresa> {
    return this.empresaService.findById(empresaId);
  }

  @Get('/:empresaId/profile')
  @ApiResponse({
    status: 200,
    description: 'Get a empresa profile by id',
  })
  @ApiNotFoundResponse({ status: 400, description: 'empresa not found' })
  public async getEmpresa(@Param('empresaId') empresaId: string): Promise<any> {
    const empresa = await this.findOneEmpresa(empresaId);

    if (!empresa) {
      throw new NotFoundException('empresa does not exist!');
    }

    return {
      empresa: empresa,
      status: HttpStatus.OK,
    };
  }

  @Put('/:empresaId/profile')
  @ApiResponse({
    status: 200,
    description: 'Update a empresa profile by id',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'empresa profile not updated',
  })
  public async updateEmpresaProfile(
    @Param('empresaId') empresaId: string,
    @Body() empresaProfileDto: EmpresaProfileDto,
  ): Promise<any> {
    try {
      await this.empresaService.updateEmpresaProfile(empresaId, empresaProfileDto);

      return {
        message: 'empresa Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: empresa not updated!');
    }
  }

  @Put('/:empresaId')
  @ApiResponse({
    status: 200,
    description: 'Update a empresa by id',
  })
  @ApiBadRequestResponse({ status: 400, description: 'empresa not updated' })
  public async updateEmpresa(
    @Param('empresaId') empresaId: string,
    @Body() empresaUpdateDto: EmpresaUpdateDto,
  ): Promise<any> {
    try {
      const id = Number(empresaId);
      if (isNaN(id)) {
        throw new BadRequestException('Invalid empresaId');
      }
  
      await this.empresaService.updateEmpresa(id.toString(), empresaUpdateDto);
  
      return {
        message: 'Empresa Updated successfully!',
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException('Error: empresa not updated!', err);
    }
  }  

  @Delete('/:empresaId')
  @ApiResponse({
    status: 200,
    description: 'Delete a empresa by id',
  })
  @ApiNoContentResponse({ status: 404, description: 'empresa not deleted' })
  public async deleteEmpresa(@Param('empresaId') empresaId: string): Promise<void> {
    await this.empresaService.deleteEmpresa(empresaId);
  }
}
