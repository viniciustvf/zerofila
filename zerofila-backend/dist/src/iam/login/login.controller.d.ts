import { LoginService } from './login.service';
import { LoginDto } from '../login/dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class LoginController {
    private readonly loginService;
    constructor(loginService: LoginService);
    login(loginDto: LoginDto): Promise<any>;
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        empresa: {
            id: number;
            name: string;
            email: string;
        };
    }>;
}
