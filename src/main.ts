import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  // const corsOptions = { origin: 'http://localhost:4200' }
  const app = await NestFactory.create(AppModule);
  // app.use(cors());
  // var cors = require('cors')
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  // register adapter
  app.useWebSocketAdapter(new WsAdapter(app) as any);
  app.enableCors({origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true});
  await app.listen(process.env.PORT);
}
bootstrap();
