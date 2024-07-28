import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FilterExceptions } from './utils/exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  
  // FILTER EXCEPTINS AND PREVENT SERVER CRASHES
  app.useGlobalFilters(new FilterExceptions())
  await app.listen(process.env.PORT);
}
bootstrap();
