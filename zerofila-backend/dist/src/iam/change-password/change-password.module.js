"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordModule = void 0;
const common_1 = require("@nestjs/common");
const change_password_controller_1 = require("./change-password.controller");
const change_password_service_1 = require("./change-password.service");
const typeorm_1 = require("@nestjs/typeorm");
const empresa_model_1 = require("../../empresa/models/empresa.model");
const empresa_service_1 = require("../../empresa/empresa.service");
const mailer_module_1 = require("../../shared/mailer/mailer.module");
const bcrypt_service_1 = require("../../shared/hashing/bcrypt.service");
const hashing_service_1 = require("../../shared/hashing/hashing.service");
const core_1 = require("@nestjs/core");
const authentication_guard_1 = require("../login/guards/authentication/authentication.guard");
const access_token_guard_1 = require("../login/guards/access-token/access-token.guard");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const jwt_config_1 = require("../login/config/jwt.config");
const empresa_repository_provider_1 = require("../../empresa/repositories/empresa.repository.provider");
let ChangePasswordModule = class ChangePasswordModule {
};
exports.ChangePasswordModule = ChangePasswordModule;
exports.ChangePasswordModule = ChangePasswordModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forFeature(jwt_config_1.default),
            typeorm_1.TypeOrmModule.forFeature([empresa_model_1.Empresa]),
            mailer_module_1.MailerModule,
        ],
        controllers: [change_password_controller_1.ChangePasswordController],
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
            change_password_service_1.ChangePasswordService,
            empresa_service_1.EmpresaService,
            jwt_1.JwtService,
            ...(0, empresa_repository_provider_1.provideEmpresaRepository)(),
        ],
    })
], ChangePasswordModule);
//# sourceMappingURL=change-password.module.js.map