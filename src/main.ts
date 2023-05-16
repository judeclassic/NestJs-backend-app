import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // { transport: Transport.KAFKA },
  );
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8080);
}
bootstrap();
