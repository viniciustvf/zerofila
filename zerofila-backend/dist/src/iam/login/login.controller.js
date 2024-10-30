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
exports.LoginController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const login_service_1 = require("./login.service");
const login_dto_1 = require("../login/dto/login.dto");
const swagger_1 = require("@nestjs/swagger");
const auth_type_enum_1 = require("./enums/auth-type.enum");
const auth_guard_decorator_1 = require("./decorators/auth-guard.decorator");
const refresh_token_dto_1 = require("./dto/refresh-token.dto");
let LoginController = class LoginController {
    constructor(loginService) {
        this.loginService = loginService;
    }
    async login(loginDto) {
        return await this.loginService.login(loginDto);
    }
    async refreshTokens(refreshTokenDto) {
        return await this.loginService.refreshTokens(refreshTokenDto);
    }
};
exports.LoginController = LoginController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: 'Authentication a user with email and password credentials and return token',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ status: 401, description: 'Forbidden' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh-tokens'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({
        status: 200,
        description: 'Refresh tokens and return new tokens',
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ status: 401, description: 'Forbidden' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refresh_token_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "refreshTokens", null);
exports.LoginController = LoginController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, auth_guard_decorator_1.AuthGuard)(auth_type_enum_1.AuthType.None),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [login_service_1.LoginService])
], LoginController);
//# sourceMappingURL=login.controller.js.map