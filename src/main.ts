import { NestFactory } from '@nestjs/core';
import { AppModule } from './presentation/modules/app.module';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';
import { GlobalValidationPipe, validationOptions } from './presentation/pipes/global.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new DomainErrorFilter())
  app.useGlobalPipes(new GlobalValidationPipe())
  await app.listen(process.env.PORT ?? 3001)
}
bootstrap();
