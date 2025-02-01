"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configure_swagger_docs_helper_1 = require("./helpers/configure-swagger-docs.helper");
const configure_auth_swagger_docs_helper_1 = require("./helpers/configure-auth-swagger-docs.helper");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
async function bootstrap() {
    const fastifyAdapter = new platform_fastify_1.FastifyAdapter();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, fastifyAdapter);
    const configService = app.get(config_1.ConfigService);
    await fastifyAdapter.register(require('@fastify/cors'), {
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        credentials: true,
    });
    app.useWebSocketAdapter(new platform_socket_io_1.IoAdapter(app));
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    (0, configure_auth_swagger_docs_helper_1.configureAuthSwaggerDocs)(app, configService);
    (0, configure_swagger_docs_helper_1.configureSwaggerDocs)(app, configService);
    const port = configService.get('NODE_API_PORT') || 3000;
    await app.listen(port, '0.0.0.0');
    if (configService.get('NODE_ENV') !== 'production') {
        common_1.Logger.debug(`${await app.getUrl()} - Environment: ${configService.get('NODE_ENV')}`, 'Environment');
        common_1.Logger.debug(`Url for OpenApi: ${await app.getUrl()}/docs`, 'Swagger');
    }
}
bootstrap();
//# sourceMappingURL=main.js.map