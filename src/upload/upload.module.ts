import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UploadConsumer } from './upload.consumer';
import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';

@Module({
    providers: [UploadService, UploadResolver, UploadConsumer],
    imports: [
      BullModule.registerQueue({
        name: 'file-upload-queue',
      }),
    ]
  })
  export class UploadModule {}
