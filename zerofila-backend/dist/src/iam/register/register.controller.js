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
exports.RegisterController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const register_service_1 = require("./register.service");
const swagger_1 = require("@nestjs/swagger");
const auth_type_enum_1 = require("../login/enums/auth-type.enum");
const auth_guard_decorator_1 = require("../login/decorators/auth-guard.decorator");
const register_empresa_dto_1 = require("./dto/register-empresa.dto");
let RegisterController = class RegisterController {
    constructor(registerService) {
        this.registerService = registerService;
    }
    async register(registerEmpresaDto) {
        try {
            await this.registerService.register(registerEmpresaDto);
            return {
                message: 'Empresa registration successfully!',
                status: common_1.HttpStatus.CREATED,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err, 'Error: Empresa not registration!');
        }
    }
};
exports.RegisterController = RegisterController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(201),
    (0, swagger_1.ApiOkResponse)({
        status: 201,
        description: 'Register a new empresa and send a confirmation email to the empresa',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ status: 400, description: 'Bad request' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_empresa_dto_1.RegisterEmpresaDto]),
    __metadata("design:returntype", Promise)
], RegisterController.prototype, "register", null);
exports.RegisterController = RegisterController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, auth_guard_decorator_1.AuthGuard)(auth_type_enum_1.AuthType.None),
    (0, common_1.Controller)('auth/register'),
    __metadata("design:paramtypes", [register_service_1.RegisterService])
], RegisterController);
//# sourceMappingURL=register.controller.js.map