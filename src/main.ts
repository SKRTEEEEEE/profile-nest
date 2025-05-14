import { NestFactory } from '@nestjs/core';
import { AppModule } from './presentation/modules/app.module';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new DomainErrorFilter())
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
