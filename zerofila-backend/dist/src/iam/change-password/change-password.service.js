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
exports.ChangePasswordService = void 0;
const common_1 = require("@nestjs/common");
const empresa_service_1 = require("../../empresa/empresa.service");
const mailer_service_1 = require("../../shared/mailer/mailer.service");
const mailer_constants_1 = require("../../shared/mailer/mailer.constants");
let ChangePasswordService = class ChangePasswordService {
    constructor(empresaService, mailerService) {
        this.empresaService = empresaService;
        this.mailerService = mailerService;
    }
    async changePassword(changePasswordDto) {
        this.sendMailChangePassword(changePasswordDto);
        return await this.empresaService.updateByPassword(changePasswordDto.email, changePasswordDto.password);
    }
    sendMailChangePassword(user) {
        try {
            this.mailerService.sendMail({
                to: user.email,
                from: 'from@example.com',
                subject: 'Change Password successful ✔',
                text: 'Change Password successful!',
                html: (0, mailer_constants_1.changePasswordEmail)(user),
            });
            common_1.Logger.log('[MailService] Change Password: Send Mail successfully!');
        }
        catch (err) {
            common_1.Logger.error('[MailService] Change Password: Send Mail Failed!', err);
        }
    }
};
exports.ChangePasswordService = ChangePasswordService;
exports.ChangePasswordService = ChangePasswordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService,
        mailer_service_1.MailerService])
], ChangePasswordService);
//# sourceMappingURL=change-password.service.js.map