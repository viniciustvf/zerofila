"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterEmpresaDto = void 0;
const openapi = require("@nestjs/swagger");
const empresa_dto_1 = require("../../../empresa/dto/empresa.dto");
class RegisterEmpresaDto extends empresa_dto_1.EmpresaDto {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.RegisterEmpresaDto = RegisterEmpresaDto;
//# sourceMappingURL=register-empresa.dto.js.map