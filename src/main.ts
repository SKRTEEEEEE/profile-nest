import { NestFactory } from '@nestjs/core';
import { DomainErrorFilter } from './shareds/presentation/filters/domain-error.filter';
import { GlobalValidationPipe } from './shareds/presentation/pipes/global.validation';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONFIGS } from './shareds/swagger/swagger.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new DomainErrorFilter())
  app.useGlobalPipes(new GlobalValidationPipe())
  const cfg = SWAGGER_CONFIGS.ADMIN;
  if (!process.env.JWT_STRATEGY) {
  throw new Error('JWT_STRATEGY env variable is required');
}

  const config = new DocumentBuilder()
    .setTitle(cfg.title)
    .setDescription(cfg.description)
    .setVersion(cfg.version)
    .addBearerAuth(
      {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Ingrese el token JWT en el campo',
    },
      'access-token'
    )
    // .addBearerAuth({
    //   type: "http",
    //   scheme: "custom",
    //   in: "header",
    //   name: "my-token",
    //   description: "esto es un test",
    // }, "test-token")
    .build();

    
  const documentFactory = ()=>SwaggerModule.createDocument(app, config);
 
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001)
}
bootstrap();
