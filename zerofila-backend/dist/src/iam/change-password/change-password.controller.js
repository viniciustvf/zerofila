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
exports.ChangePasswordController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const change_password_service_1 = require("./change-password.service");
const change_password_dto_1 = require("./dto/change-password.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_guard_decorator_1 = require("../login/decorators/auth-guard.decorator");
const auth_type_enum_1 = require("../login/enums/auth-type.enum");
let ChangePasswordController = class ChangePasswordController {
    constructor(changePasswordService) {
        this.changePasswordService = changePasswordService;
    }
    async changePassword(changePasswordDto) {
        try {
            await this.changePasswordService.changePassword(changePasswordDto);
            return {
                message: 'Request Change Password Successfully!',
                status: common_1.HttpStatus.OK,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err, 'Error: Change password failed!');
        }
    }
};
exports.ChangePasswordController = ChangePasswordController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: 'Request Change Password and send a confirmation email to the user',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ status: 400, description: 'Bad request' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], ChangePasswordController.prototype, "changePassword", null);
exports.ChangePasswordController = ChangePasswordController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, auth_guard_decorator_1.AuthGuard)(auth_type_enum_1.AuthType.Bearer),
    (0, common_1.Controller)('auth/change-password'),
    __metadata("design:paramtypes", [change_password_service_1.ChangePasswordService])
], ChangePasswordController);
//# sourceMappingURL=change-password.controller.js.map