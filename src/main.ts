import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { WsAdapter } from '@nestjs/platform-ws';
import { asap } from 'rxjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // var cors = require('cors')
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  // register adapter
  app.useWebSocketAdapter(new WsAdapter(app) as any);
  app.enableCors({origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true});
  await app.listen(3000);
}
bootstrap();
