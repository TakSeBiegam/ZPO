import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(
    session({
      secret: 'dev-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: true },
    }),
  );

  await app.listen(3001);
}

bootstrap();
