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
exports.EmpresaController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const empresa_service_1 = require("./empresa.service");
const empresa_profile_dto_1 = require("./dto/empresa-profile.dto");
const empresa_update_dto_1 = require("./dto/empresa-update.dto");
const swagger_1 = require("@nestjs/swagger");
let EmpresaController = class EmpresaController {
    constructor(empresaService) {
        this.empresaService = empresaService;
    }
    async findAllEmpresa() {
        return this.empresaService.findAll();
    }
    async findOneEmpresa(empresaId) {
        return this.empresaService.findById(empresaId);
    }
    async getEmpresa(empresaId) {
        const empresa = await this.findOneEmpresa(empresaId);
        if (!empresa) {
            throw new common_1.NotFoundException('empresa does not exist!');
        }
        return {
            empresa: empresa,
            status: common_1.HttpStatus.OK,
        };
    }
    async updateEmpresaProfile(empresaId, empresaProfileDto) {
        try {
            await this.empresaService.updateEmpresaProfile(empresaId, empresaProfileDto);
            return {
                message: 'empresa Updated successfully!',
                status: common_1.HttpStatus.OK,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err, 'Error: empresa not updated!');
        }
    }
    async updateEmpresa(empresaId, empresaUpdateDto) {
        try {
            await this.empresaService.updateEmpresa(empresaId, empresaUpdateDto);
            return {
                message: 'empresa Updated successfully!',
                status: common_1.HttpStatus.OK,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err, 'Error: empresa not updated!');
        }
    }
    async deleteEmpresa(empresaId) {
        await this.empresaService.deleteEmpresa(empresaId);
    }
};
exports.EmpresaController = EmpresaController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get all empresa',
    }),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "findAllEmpresa", null);
__decorate([
    (0, common_1.Get)('/:empresaId'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get a empresa by id',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ status: 400, description: 'empresa not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "findOneEmpresa", null);
__decorate([
    (0, common_1.Get)('/:empresaId/profile'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Get a empresa profile by id',
    }),
    (0, swagger_1.ApiNotFoundResponse)({ status: 400, description: 'empresa not found' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getEmpresa", null);
__decorate([
    (0, common_1.Put)('/:empresaId/profile'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Update a empresa profile by id',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        status: 400,
        description: 'empresa profile not updated',
    }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, empresa_profile_dto_1.EmpresaProfileDto]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "updateEmpresaProfile", null);
__decorate([
    (0, common_1.Put)('/:empresaId'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Update a empresa by id',
    }),
    (0, swagger_1.ApiBadRequestResponse)({ status: 400, description: 'empresa not updated' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('empresaId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, empresa_update_dto_1.EmpresaUpdateDto]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "updateEmpresa", null);
__decorate([
    (0, common_1.Delete)('/:empresaId'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Delete a empresa by id',
    }),
    (0, swagger_1.ApiNoContentResponse)({ status: 404, description: 'empresa not deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('empresaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "deleteEmpresa", null);
exports.EmpresaController = EmpresaController = __decorate([
    (0, swagger_1.ApiTags)('empresa'),
    (0, common_1.Controller)('empresa'),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService])
], EmpresaController);
//# sourceMappingURL=empresa.controller.js.map