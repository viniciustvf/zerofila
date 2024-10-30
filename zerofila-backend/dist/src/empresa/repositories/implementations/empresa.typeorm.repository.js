"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaTypeOrmRepository = void 0;
class EmpresaTypeOrmRepository {
    constructor(empresaRepository, hashingService) {
        this.empresaRepository = empresaRepository;
        this.hashingService = hashingService;
    }
    async findAll() {
        return await this.empresaRepository.find();
    }
    async findByEmail(email) {
        return await this.empresaRepository.findOneBy({
            email: email,
        });
    }
    async findBySub(sub) {
        return await this.empresaRepository.findOneByOrFail({
            id: sub,
        });
    }
    async findById(empresaId) {
        return await this.empresaRepository.findOneBy({
            id: +empresaId,
        });
    }
    async create(empresaDto) {
        return await this.empresaRepository.save(empresaDto);
    }
    async updateByEmail(email) {
        const empresa = await this.empresaRepository.findOneBy({ email: email });
        empresa.password = await this.hashingService.hash(Math.random().toString(36).slice(-8));
        return await this.empresaRepository.save(empresa);
    }
    async updateByPassword(email, password) {
        const empresa = await this.empresaRepository.findOneBy({ email: email });
        empresa.password = await this.hashingService.hash(password);
        return await this.empresaRepository.save(empresa);
    }
    async updateEmpresaProfile(id, empresaProfileDto) {
        const empresa = await this.empresaRepository.findOneBy({ id: +id });
        empresa.name = empresaProfileDto.name;
        empresa.email = empresaProfileDto.email;
        empresa.username = empresaProfileDto.username;
        return await this.empresaRepository.save(empresa);
    }
    async updateEmpresa(id, empresaUpdateDto) {
        return await this.empresaRepository.update({
            id: +id,
        }, { ...empresaUpdateDto });
    }
    async deleteEmpresa(Empresa) {
        await this.empresaRepository.remove(Empresa);
    }
}
exports.EmpresaTypeOrmRepository = EmpresaTypeOrmRepository;
//# sourceMappingURL=empresa.typeorm.repository.js.map