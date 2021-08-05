import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { UploadProcessor } from './upload.processor';
import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';

@Module({
    providers: [UploadService, UploadResolver, UploadProcessor],
    imports: [
      BullModule.registerQueue({
        name: 'file-upload-queue',
      }),
    ]
  })
  export class UploadModule {}
