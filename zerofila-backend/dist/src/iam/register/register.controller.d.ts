import { RegisterService } from './register.service';
import { RegisterEmpresaDto } from './dto/register-empresa.dto';
export declare class RegisterController {
    private readonly registerService;
    constructor(registerService: RegisterService);
    register(registerEmpresaDto: RegisterEmpresaDto): Promise<any>;
}
