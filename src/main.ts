import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const corsOptions: CorsOptions = {
    origin: ['http://localhost:5173', 'https://ecom-frontend.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  };

  app.enableCors(corsOptions);

  await app.listen(4200);
}
bootstrap();
