"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bcrypt_service_1 = require("../../shared/hashing/bcrypt.service");
const hashing_service_1 = require("../../shared/hashing/hashing.service");
const mailer_module_1 = require("../../shared/mailer/mailer.module");
const empresa_model_1 = require("../../empresa/models/empresa.model");
const empresa_service_1 = require("../../empresa/empresa.service");
const register_controller_1 = require("./register.controller");
const register_service_1 = require("./register.service");
const empresa_repository_provider_1 = require("../../empresa/repositories/empresa.repository.provider");
let RegisterModule = class RegisterModule {
};
exports.RegisterModule = RegisterModule;
exports.RegisterModule = RegisterModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([empresa_model_1.Empresa]), mailer_module_1.MailerModule],
        controllers: [register_controller_1.RegisterController],
        providers: [
            {
                provide: hashing_service_1.HashingService,
                useClass: bcrypt_service_1.BcryptService,
            },
            register_service_1.RegisterService,
            empresa_service_1.EmpresaService,
            ...(0, empresa_repository_provider_1.provideEmpresaRepository)(),
        ],
    })
], RegisterModule);
//# sourceMappingURL=register.module.js.map