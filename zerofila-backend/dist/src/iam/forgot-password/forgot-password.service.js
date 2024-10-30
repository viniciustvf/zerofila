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
exports.ForgotPasswordService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const empresa_model_1 = require("../../empresa/models/empresa.model");
const mailer_service_1 = require("../../shared/mailer/mailer.service");
const utils_service_1 = require("../../shared/utils/utils.service");
const hashing_service_1 = require("../../shared/hashing/hashing.service");
const mailer_constants_1 = require("../../shared/mailer/mailer.constants");
let ForgotPasswordService = class ForgotPasswordService {
    constructor(empresaRepository, mailerService, utilsService, hashingService) {
        this.empresaRepository = empresaRepository;
        this.mailerService = mailerService;
        this.utilsService = utilsService;
        this.hashingService = hashingService;
    }
    async forgotPassword(forgotPasswordDto) {
        const empresaUpdate = await this.empresaRepository.findOneBy({
            email: forgotPasswordDto.email,
        });
        const passwordRand = this.utilsService.generatePassword();
        empresaUpdate.password = await this.hashingService.hash(passwordRand);
        this.sendMailForgotPassword(empresaUpdate.email, passwordRand);
        return await this.empresaRepository.save(empresaUpdate);
    }
    sendMailForgotPassword(email, password) {
        try {
            this.mailerService.sendMail({
                to: email,
                from: 'from@example.com',
                subject: 'Forgot Password successful ✔',
                text: 'Forgot Password successful!',
                html: (0, mailer_constants_1.forgotPasswordEmail)(password),
            });
            common_1.Logger.log('[MailService] Forgot Password: Send Mail successfully!');
        }
        catch (err) {
            common_1.Logger.error('[MailService] Forgot Password: Send Mail Failed!', err);
        }
    }
};
exports.ForgotPasswordService = ForgotPasswordService;
exports.ForgotPasswordService = ForgotPasswordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(empresa_model_1.Empresa)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        mailer_service_1.MailerService,
        utils_service_1.UtilsService,
        hashing_service_1.HashingService])
], ForgotPasswordService);
//# sourceMappingURL=forgot-password.service.js.map