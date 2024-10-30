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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterService = void 0;
const common_1 = require("@nestjs/common");
const hashing_service_1 = require("../../shared/hashing/hashing.service");
const mailer_service_1 = require("../../shared/mailer/mailer.service");
const empresa_service_1 = require("../../empresa/empresa.service");
const mailer_constants_1 = require("../../shared/mailer/mailer.constants");
let RegisterService = class RegisterService {
    constructor(empresaService, mailerService, hashingService) {
        this.empresaService = empresaService;
        this.mailerService = mailerService;
        this.hashingService = hashingService;
    }
    async register(registerEmpresaDto) {
        registerEmpresaDto.password = await this.hashingService.hash(registerEmpresaDto.password);
        this.sendMailRegisterEmpresa(registerEmpresaDto);
        return this.empresaService.create(registerEmpresaDto);
    }
    sendMailRegisterEmpresa(user) {
        try {
            this.mailerService.sendMail({
                to: user.email,
                from: 'from@example.com',
                subject: 'Registration successful ✔',
                html: (0, mailer_constants_1.registrationEmail)(user),
            });
            common_1.Logger.log('[MailService] Empresa Registration: Send Mail successfully!');
        }
        catch (err) {
            common_1.Logger.error('[MailService] Empresa Registration: Send Mail failed!', err);
        }
    }
};
exports.RegisterService = RegisterService;
exports.RegisterService = RegisterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService,
        mailer_service_1.MailerService,
        hashing_service_1.HashingService])
], RegisterService);
//# sourceMappingURL=register.service.js.map