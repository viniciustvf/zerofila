"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSwaggerDocs = configureSwaggerDocs;
const swagger_1 = require("@nestjs/swagger");
const SWAGGER_ENVS = ['local', 'dev', 'staging'];
function configureSwaggerDocs(app, configService) {
    if (SWAGGER_ENVS.includes(configService.get('NODE_ENV'))) {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('API')
            .setDescription('The API description')
            .setVersion('1.0')
            .addServer('http://localhost:3000', 'Local server')
            .addTag('auth')
            .addTag('empresa')
            .addTag('fila')
            .addTag('client')
            .addBearerAuth({
            description: 'Please enter token:',
            name: 'Authorization',
            bearerFormat: 'Bearer',
            scheme: 'Bearer',
            type: 'http',
            in: 'Header',
        })
            .build();
        const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('/docs', app, documentFactory, {
            explorer: true,
            swaggerOptions: {
                filter: true,
                showRequestDuration: true,
            },
            jsonDocumentUrl: '/docs/json',
            yamlDocumentUrl: '/docs/yaml',
        });
    }
}
//# sourceMappingURL=configure-swagger-docs.helper.js.map