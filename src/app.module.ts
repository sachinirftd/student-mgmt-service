import { Module } from '@nestjs/common';
import { GraphQLFederationModule, GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UploadService } from './upload/upload.service';
import { UploadResolver } from './upload/upload.resolver';
import { UploadModule } from './upload/upload.module';
import { BullModule } from '@nestjs/bull';
import { GraphQLUpload } from "graphql-upload";
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    GraphQLFederationModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
      uploads: false,
      context: req => ({ req }),
      resolvers: {
        Upload: GraphQLUpload,
      },
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    UploadModule,
    ConfigModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
