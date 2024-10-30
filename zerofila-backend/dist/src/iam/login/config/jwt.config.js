"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.default = (0, config_1.registerAs)('jwt', () => {
    return {
        secret: configService.get('JWT_SECRET_KEY'),
        audience: configService.get('JWT_TOKEN_AUDIENCE'),
        issuer: configService.get('JWT_TOKEN_ISSUER'),
        accessTokenTtl: parseInt(configService.get('JWT_ACCESS_TOKEN_TTL') ?? '3600', 10),
        refreshTokenTtl: parseInt(configService.get('JWT_REFRESH_TOKEN_TTL') ?? '86400', 10),
    };
});
//# sourceMappingURL=jwt.config.js.map