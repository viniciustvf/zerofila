"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const empresa_model_1 = require("./models/empresa.model");
const empresa_service_1 = require("./empresa.service");
const empresa_controller_1 = require("./empresa.controller");
const mailer_module_1 = require("../shared/mailer/mailer.module");
const bcrypt_service_1 = require("../shared/hashing/bcrypt.service");
const hashing_service_1 = require("../shared/hashing/hashing.service");
const empresa_repository_provider_1 = require("./repositories/empresa.repository.provider");
let EmpresaModule = class EmpresaModule {
};
exports.EmpresaModule = EmpresaModule;
exports.EmpresaModule = EmpresaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([empresa_model_1.Empresa]), mailer_module_1.MailerModule],
        controllers: [empresa_controller_1.EmpresaController],
        providers: [
            {
                provide: hashing_service_1.HashingService,
                useClass: bcrypt_service_1.BcryptService,
            },
            empresa_service_1.EmpresaService,
            ...(0, empresa_repository_provider_1.provideEmpresaRepository)(),
        ],
        exports: [...(0, empresa_repository_provider_1.provideEmpresaRepository)()],
    })
], EmpresaModule);
//# sourceMappingURL=empresa.module.js.map