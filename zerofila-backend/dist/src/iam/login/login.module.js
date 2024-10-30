"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginModule = void 0;
const common_1 = require("@nestjs/common");
const login_service_1 = require("./login.service");
const login_controller_1 = require("./login.controller");
const typeorm_1 = require("@nestjs/typeorm");
const empresa_model_1 = require("../../empresa/models/empresa.model");
const jwt_1 = require("@nestjs/jwt");
const empresa_service_1 = require("../../empresa/empresa.service");
const config_1 = require("@nestjs/config");
const hashing_service_1 = require("../../shared/hashing/hashing.service");
const bcrypt_service_1 = require("../../shared/hashing/bcrypt.service");
const core_1 = require("@nestjs/core");
const authentication_guard_1 = require("./guards/authentication/authentication.guard");
const access_token_guard_1 = require("./guards/access-token/access-token.guard");
const jwt_config_1 = require("./config/jwt.config");
const empresa_repository_provider_1 = require("../../empresa/repositories/empresa.repository.provider");
let LoginModule = class LoginModule {
};
exports.LoginModule = LoginModule;
exports.LoginModule = LoginModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([empresa_model_1.Empresa]),
            config_1.ConfigModule.forFeature(jwt_config_1.default),
            jwt_1.JwtModule.registerAsync(jwt_config_1.default.asProvider()),
        ],
        providers: [
            {
                provide: hashing_service_1.HashingService,
                useClass: bcrypt_service_1.BcryptService,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: authentication_guard_1.AuthenticationGuard,
            },
            access_token_guard_1.AccessTokenGuard,
            login_service_1.LoginService,
            empresa_service_1.EmpresaService,
            ...(0, empresa_repository_provider_1.provideEmpresaRepository)(),
        ],
        controllers: [login_controller_1.LoginController],
    })
], LoginModule);
//# sourceMappingURL=login.module.js.map