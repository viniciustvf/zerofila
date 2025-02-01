"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = exports.IS_PUBLIC_KEY = exports.AuthGuard = exports.AUTH_TYPE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.AUTH_TYPE_KEY = 'authType';
const AuthGuard = (...authTypes) => (0, common_1.SetMetadata)(exports.AUTH_TYPE_KEY, authTypes);
exports.AuthGuard = AuthGuard;
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
//# sourceMappingURL=auth-guard.decorator.js.map