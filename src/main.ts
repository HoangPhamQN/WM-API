import { NestFactory } from '@nestjs/core';
import * as firebase from 'firebase/app';
import { ValidationPipe } from './utils/validation.pipe';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './utils/exception';
import firebaseConfig from './utils/firebase.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  firebase.initializeApp(firebaseConfig);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
