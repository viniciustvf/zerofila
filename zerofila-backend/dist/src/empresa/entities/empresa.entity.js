"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empresa = void 0;
const openapi = require("@nestjs/swagger");
class Empresa {
    constructor(id, name, email, username, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.Empresa = Empresa;
//# sourceMappingURL=empresa.entity.js.map