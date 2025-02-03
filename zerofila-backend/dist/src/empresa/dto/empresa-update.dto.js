"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaUpdateDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const empresa_dto_1 = require("./empresa.dto");
class EmpresaUpdateDto extends (0, swagger_1.OmitType)((0, swagger_1.PartialType)(empresa_dto_1.EmpresaDto), ['password']) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.EmpresaUpdateDto = EmpresaUpdateDto;
//# sourceMappingURL=empresa-update.dto.js.map