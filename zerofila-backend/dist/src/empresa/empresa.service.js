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
exports.EmpresaService = void 0;
const common_1 = require("@nestjs/common");
const empresa_repository_interface_1 = require("./repositories/empresa.repository.interface");
const empresa_typeorm_repository_1 = require("./repositories/implementations/empresa.typeorm.repository");
let EmpresaService = class EmpresaService {
    constructor(empresaRepository) {
        this.empresaRepository = empresaRepository;
    }
    async findAll() {
        return await this.empresaRepository.findAll();
    }
    async findByEmail(email) {
        const empresa = await this.empresaRepository.findByEmail(email);
        if (!empresa) {
            throw new common_1.NotFoundException(`empresa not found`);
        }
        return empresa;
    }
    async findBySub(sub) {
        const empresa = await this.empresaRepository.findBySub(sub);
        if (!empresa) {
            throw new common_1.NotFoundException(`empresa not found`);
        }
        return empresa;
    }
    async findById(empresaId) {
        const empresa = await this.empresaRepository.findById(empresaId);
        if (!empresa) {
            throw new common_1.NotFoundException(`empresa #${empresaId} not found`);
        }
        return empresa;
    }
    async create(empresaDto) {
        try {
            return await this.empresaRepository.create(empresaDto);
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateByEmail(email) {
        try {
            return await this.empresaRepository.updateByEmail(email);
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateByPassword(email, password) {
        try {
            return await this.empresaRepository.updateByPassword(email, password);
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateEmpresaProfile(id, empresaProfileDto) {
        try {
            return await this.empresaRepository.updateEmpresaProfile(id, empresaProfileDto);
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateEmpresa(id, empresaUpdateDto) {
        try {
            return await this.empresaRepository.updateEmpresa(id, empresaUpdateDto);
        }
        catch (err) {
            throw new common_1.BadRequestException('empresa not updated');
        }
    }
    async deleteEmpresa(id) {
        const empresa = await this.findById(id);
        return await this.empresaRepository.deleteEmpresa(empresa);
    }
};
exports.EmpresaService = EmpresaService;
exports.EmpresaService = EmpresaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(empresa_repository_interface_1.EMPRESA_REPOSITORY_TOKEN)),
    __metadata("design:paramtypes", [empresa_typeorm_repository_1.EmpresaTypeOrmRepository])
], EmpresaService);
//# sourceMappingURL=empresa.service.js.map