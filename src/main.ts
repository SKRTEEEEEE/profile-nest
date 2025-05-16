import { NestFactory } from '@nestjs/core';
import { DomainErrorFilter } from './shareds/presentation/filters/domain-error.filter';
import { GlobalValidationPipe } from './shareds/presentation/pipes/global.validation';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new DomainErrorFilter())
  app.useGlobalPipes(new GlobalValidationPipe())
  await app.listen(process.env.PORT ?? 3001)
}
bootstrap();
