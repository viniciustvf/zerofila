"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchemaEnv = void 0;
const common_1 = require("@nestjs/common");
const ajv_1 = require("ajv");
const ajv = new ajv_1.default({ allErrors: true, useDefaults: true });
const schema = {
    type: 'object',
    properties: {
        TYPEORM_HOST: { type: 'string' },
        TYPEORM_PORT: { type: 'string' },
        TYPEORM_USERNAME: { type: 'string' },
        TYPEORM_PASSWORD: { type: 'string' },
        TYPEORM_DATABASE: { type: 'string' },
    },
    required: [
        'TYPEORM_HOST',
        'TYPEORM_PORT',
        'TYPEORM_USERNAME',
        'TYPEORM_PASSWORD',
        'TYPEORM_DATABASE',
    ],
};
const validate = ajv.compile(schema);
const validateSchemaEnv = (env) => {
    const valid = validate(env);
    if (!valid) {
        const errorMessages = validate.errors
            .map((err) => ` Property${err.instancePath} ${err.message}`)
            .join(', ');
        common_1.Logger.error(`Environment validation error:${errorMessages}`, 'EnvValidation');
    }
    return env;
};
exports.validateSchemaEnv = validateSchemaEnv;
//# sourceMappingURL=validation-schema-env.js.map