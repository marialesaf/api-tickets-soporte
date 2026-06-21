import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validaciones globales si las usas
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 👉 AQUÍ REGISTRAMOS EL FILTRO DE PRISMA
  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(3000);
}
bootstrap();