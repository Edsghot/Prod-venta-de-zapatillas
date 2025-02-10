import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importar ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });

  // Habilitar la validación globala
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 5039;
  await app.listen(port);
}

bootstrap();
