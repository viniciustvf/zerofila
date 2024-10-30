"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuthSwaggerDocs = configureAuthSwaggerDocs;
function configureAuthSwaggerDocs(app, configService) {
    const apiDocumentationCredentials = {
        empresa: configService.get('SWAGGER_USER'),
        password: configService.get('SWAGGER_PASSWORD'),
    };
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.use('/docs', (req, res, next) => {
        function parseAuthHeader(input) {
            const [, encodedPart] = input.split(' ');
            const buff = Buffer.from(encodedPart, 'base64');
            const text = buff.toString('ascii');
            const [empresa, password] = text.split(':');
            return { empresa, password };
        }
        function unauthorizedResponse() {
            if (httpAdapter.getType() === 'fastify') {
                res.statusCode = 401;
                res.setHeader('WWW-Authenticate', 'Basic');
            }
            else {
                res.status(401);
                res.set('WWW-Authenticate', 'Basic');
            }
            next();
        }
        if (!req.headers.authorization) {
            return unauthorizedResponse();
        }
        const credentials = parseAuthHeader(req.headers.authorization);
        if (credentials?.empresa !== apiDocumentationCredentials.empresa ||
            credentials?.password !== apiDocumentationCredentials.password) {
            return unauthorizedResponse();
        }
        next();
    });
}
//# sourceMappingURL=configure-auth-swagger-docs.helper.js.map