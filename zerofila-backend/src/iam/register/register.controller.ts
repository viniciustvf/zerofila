import {
  Controller,
  Post,
  Body,
  HttpStatus,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthType } from '../login/enums/auth-type.enum';
import { AuthGuard } from '../login/decorators/auth-guard.decorator';
import { RegisterEmpresaDto } from './dto/register-empresa.dto';

@ApiTags('auth')
@AuthGuard(AuthType.None)
@Controller('auth/register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  @HttpCode(201)
  @ApiOkResponse({
    status: 201,
    description:
      'Register a new empresa and send a confirmation email to the empresa',
  })
  @ApiBadRequestResponse({ status: 400, description: 'Bad request' })
  public async register(
    @Body() registerEmpresaDto: RegisterEmpresaDto,
  ): Promise<any> {
    try {
      await this.registerService.register(registerEmpresaDto);

      return {
        message: 'Empresa registration successfully!',
        status: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new BadRequestException(err, 'Error: Empresa not registration!');
    }
  }
}
