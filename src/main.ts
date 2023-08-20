import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {useContainer} from "class-validator";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), {fallbackOnErrors: true});
  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap();
