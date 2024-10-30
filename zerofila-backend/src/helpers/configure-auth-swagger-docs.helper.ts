import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function configureAuthSwaggerDocs(
  app: INestApplication,
  configService: ConfigService,
) {
  const apiDocumentationCredentials = {
    empresa: configService.get<string>('SWAGGER_USER'),
    password: configService.get<string>('SWAGGER_PASSWORD'),
  };

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.use('/docs', (req: any, res: any, next: () => void) => {
    function parseAuthHeader(input: string): {
      empresa: string;
      password: string;
    } {
      const [, encodedPart] = input.split(' ');
      const buff = Buffer.from(encodedPart, 'base64');
      const text = buff.toString('ascii');
      const [empresa, password] = text.split(':');
      return { empresa, password };
    }

    function unauthorizedResponse(): void {
      if (httpAdapter.getType() === 'fastify') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic');
      } else {
        res.status(401);
        res.set('WWW-Authenticate', 'Basic');
      }
      next();
    }

    if (!req.headers.authorization) {
      return unauthorizedResponse();
    }
    
    const credentials = parseAuthHeader(req.headers.authorization);
    
    if (
      credentials?.empresa !== apiDocumentationCredentials.empresa ||
      credentials?.password !== apiDocumentationCredentials.password
    ) {
      return unauthorizedResponse();
    }
    
    next();
  });
}
