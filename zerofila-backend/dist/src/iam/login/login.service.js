"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const empresa_service_1 = require("../../empresa/empresa.service");
const hashing_service_1 = require("../../shared/hashing/hashing.service");
const jwt_config_1 = require("./config/jwt.config");
let LoginService = class LoginService {
    constructor(empresaService, jwtService, jwtConfiguration, hashingService) {
        this.empresaService = empresaService;
        this.jwtService = jwtService;
        this.jwtConfiguration = jwtConfiguration;
        this.hashingService = hashingService;
    }
    async findEmpresaByEmail(loginDto) {
        return await this.empresaService.findByEmail(loginDto.email);
    }
    async login(loginDto) {
        try {
            const empresa = await this.findEmpresaByEmail(loginDto);
            if (!empresa) {
                throw new common_1.UnauthorizedException('Empresa does not exists');
            }
            const passwordIsValid = await this.hashingService.compare(loginDto.password, empresa.password);
            if (!passwordIsValid) {
                throw new common_1.UnauthorizedException('Authentication failed. Wrong password');
            }
            return await this.generateTokens(empresa);
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async generateTokens(empresa) {
        const [accessToken, refreshToken] = await Promise.all([
            this.signToken(empresa.id, this.jwtConfiguration.accessTokenTtl, { email: empresa.email }),
            this.signToken(empresa.id, this.jwtConfiguration.refreshTokenTtl),
        ]);
        return {
            accessToken,
            refreshToken,
            empresa: {
                id: empresa.id,
                name: empresa.name,
                email: empresa.email,
            },
        };
    }
    async refreshTokens(refreshTokenDto) {
        try {
            const { id } = await this.jwtService.verifyAsync(refreshTokenDto.refreshToken, {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
            });
            const empresa = await this.empresaService.findBySub(id);
            return this.generateTokens(empresa);
        }
        catch (err) {
            throw new common_1.UnauthorizedException(err);
        }
    }
    async signToken(empresaId, expiresIn, payload) {
        return await this.jwtService.signAsync({
            sub: empresaId,
            ...payload,
        }, {
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            secret: this.jwtConfiguration.secret,
            expiresIn,
        });
    }
};
exports.LoginService = LoginService;
exports.LoginService = LoginService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)(jwt_config_1.default.KEY)),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService,
        jwt_1.JwtService, void 0, hashing_service_1.HashingService])
], LoginService);
//# sourceMappingURL=login.service.js.map