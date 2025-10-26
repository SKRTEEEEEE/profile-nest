import { NestFactory } from '@nestjs/core';
import { DomainErrorFilter } from './shareds/presentation/filters/domain-error.filter';
import { GlobalValidationPipe } from './shareds/presentation/pipes/global.validation';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONFIGS } from './shareds/swagger/swagger.config';
import { dtoRegistry } from './shareds/swagger/dto.register';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { Logger } from 'nestjs-pino';

const getBearerAuthConfig = (jwtType: string) => {
  if (jwtType == 'mock')
    return {
      options: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Ingrese el token mock en el campo',
      } as SecuritySchemeObject,
      name: 'access-token',
    };
  else
    return {
      options: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Ingrese el token JWT en el campo',
      } as SecuritySchemeObject,
      name: 'access-token',
    };
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  // app.useGlobalFilters(new DomainErrorFilter(logger)); -> ver en app.modules, esta configurado ahi 😎
  app.useGlobalPipes(new GlobalValidationPipe());
  app.useLogger(logger);
  const cfg = SWAGGER_CONFIGS.ADMIN;

  const config = new DocumentBuilder()
    .setTitle(cfg.title)
    .setDescription(cfg.description)
    .setVersion(cfg.version)
    .addBearerAuth(
      getBearerAuthConfig(process.env.JWT_STRATEGY!).options,
      getBearerAuthConfig(process.env.JWT_STRATEGY!).name,
    )
    .addTag(
      'Pre Tech',
      'Handle available technologies with full functionalities in the app - logo, badges, etc..',
    )
    .addTag('Tech', 'Handle user used technologies')
    .addTag('User', 'Handle user information')
    .build();

  const documentFactory = SwaggerModule.createDocument(app, config);

  // Custom transformer to apply metadata to schemas using the registry
  const transformSchema = (schema: any, schemaName: string) => {
    const constructor = dtoRegistry[schemaName];
    if (constructor) {
      const description = Reflect.getMetadata(
        'swagger/apiDtoDescription',
        constructor,
      );
      const title = Reflect.getMetadata('swagger/apiDtoTitle', constructor);
      const group = Reflect.getMetadata('swagger/apiDtoGroup', constructor);

      if (description) schema.description = description;
      if (title) schema.title = title;
      if (group) schema['x-group'] = group;
    } else {
      logger.warn(
        `No constructor found in registry for schema: ${schemaName}`,
      ); //⚠️//🏗️ -> mirar que hacia esta parte
    }
    return schema;
  };

  // Safely transform schemas with explicit type narrowing
  const components = documentFactory.components;
  if (components) {
    // console.debug(components.schemas?.TechFormDto)
    const schemas = components.schemas;
    if (schemas) {
      Object.entries(schemas).forEach(([schemaName, schema]) => {
        if (schema) {
          schemas[schemaName] = transformSchema(schema, schemaName);
          // console.debug(schemas[schemaName])
        }
      });
    } else {
      logger.warn('No schemas found in document components.');
    }
    // console.debug(components.schemas?.TechFormDto)
    // console.debug(components.schemas?.TechFormCategory)
  } else {
    logger.warn('No components found in Swagger document.');
  }

  // Setup Swagger UI
  SwaggerModule.setup('api', app, documentFactory, {
    customCss: `
      .opblock-tag { display: none; }
      .schemes { display: flex; flex-wrap: wrap; }
      .scheme-container { margin: 10px; }
      .scheme-container h3 { font-size: 1.2em; margin-bottom: 5px; }
      .scheme-container .model { border: 1px solid #ccc; padding: 10px; border-radius: 5px; }
    `,
    // customSiteTitle: 'Your API Documentation',
    // swaggerOptions: {
    //   docExpansion: 'list',
    //   filter: true,
    //   tagsSorter: 'alpha',
    //   operationsSorter: 'alpha',
    // },
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
