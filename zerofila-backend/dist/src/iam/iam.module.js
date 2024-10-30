"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const utils_module_1 = require("../shared/utils/utils.module");
const empresa_module_1 = require("../empresa/empresa.module");
const change_password_module_1 = require("./change-password/change-password.module");
const forgot_password_module_1 = require("./forgot-password/forgot-password.module");
const login_module_1 = require("./login/login.module");
const register_module_1 = require("./register/register.module");
let IamModule = class IamModule {
};
exports.IamModule = IamModule;
exports.IamModule = IamModule = __decorate([
    (0, common_1.Module)({
        imports: [
            login_module_1.LoginModule,
            register_module_1.RegisterModule,
            empresa_module_1.EmpresaModule,
            forgot_password_module_1.ForgotPasswordModule,
            change_password_module_1.ChangePasswordModule,
            utils_module_1.UtilsModule,
        ],
        providers: [jwt_1.JwtService],
    })
], IamModule);
//# sourceMappingURL=iam.module.js.map