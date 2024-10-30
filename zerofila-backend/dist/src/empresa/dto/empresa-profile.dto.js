"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaProfileDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const empresa_dto_1 = require("./empresa.dto");
class EmpresaProfileDto extends (0, swagger_1.OmitType)(empresa_dto_1.EmpresaDto, ['password']) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.EmpresaProfileDto = EmpresaProfileDto;
//# sourceMappingURL=empresa-profile.dto.js.map