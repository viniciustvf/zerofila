import { JwtService } from '@nestjs/jwt';
import { EmpresaService } from '../../empresa/empresa.service';
import { AccountsEmpresa } from '../../empresa/interfaces/accounts-empresa.interface';
import { LoginDto } from './dto/login.dto';
import { ConfigType } from '@nestjs/config';
import { HashingService } from '../../shared/hashing/hashing.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Empresa } from '../../empresa/models/empresa.model';
import jwtConfig from './config/jwt.config';
export declare class LoginService {
    private readonly empresaService;
    private readonly jwtService;
    private readonly jwtConfiguration;
    private readonly hashingService;
    constructor(empresaService: EmpresaService, jwtService: JwtService, jwtConfiguration: ConfigType<typeof jwtConfig>, hashingService: HashingService);
    findEmpresaByEmail(loginDto: LoginDto): Promise<AccountsEmpresa>;
    login(loginDto: LoginDto): Promise<any>;
    generateTokens(empresa: Empresa): Promise<{
        accessToken: string;
        refreshToken: string;
        empresa: {
            id: number;
            name: string;
            email: string;
        };
    }>;
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        empresa: {
            id: number;
            name: string;
            email: string;
        };
    }>;
    private signToken;
}
