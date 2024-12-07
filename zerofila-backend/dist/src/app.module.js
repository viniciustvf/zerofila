"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const empresa_module_1 = require("./empresa/empresa.module");
const throttler_1 = require("@nestjs/throttler");
const iam_module_1 = require("./iam/iam.module");
const validation_schema_env_1 = require("./helpers/validation-schema-env");
const fila_module_1 = require("./fila/fila.module");
const client_module_1 = require("./client/client.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.dev', '.env.stage', '.env.prod'],
                validate: validation_schema_env_1.validateSchemaEnv,
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => [
                    {
                        ttl: config.get('THROTTLE_TTL'),
                        limit: config.get('THROTTLE_LIMIT'),
                    },
                ],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('TYPEORM_HOST'),
                    port: config.get('TYPEORM_PORT'),
                    username: config.get('TYPEORM_USERNAME'),
                    password: config.get('TYPEORM_PASSWORD'),
                    database: config.get('TYPEORM_DATABASE'),
                    synchronize: true,
                    entities: [__dirname + '/**/*.{model,entity}.{ts,js}'],
                    migrations: ['dist/migrations/**/*.js'],
                    subscribers: ['dist/subscriber/**/*.js'],
                    cli: {
                        migrationsDir: config.get('TYPEORM_MIGRATIONS_DIR'),
                        subscribersDir: config.get('TYPEORM_SUBSCRIBERS_DIR'),
                    },
                }),
            }),
            iam_module_1.IamModule,
            empresa_module_1.EmpresaModule,
            fila_module_1.FilaModule,
            client_module_1.ClientModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map