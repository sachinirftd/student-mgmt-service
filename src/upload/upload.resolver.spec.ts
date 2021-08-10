import { BullModule } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadConsumer } from './upload.consumer';
import { UploadResolver } from './upload.resolver';
import { UploadService } from './upload.service';

describe('UploadResolver', () => {
  let resolver: UploadResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadResolver, UploadService, UploadConsumer],
      imports: [
        BullModule.registerQueue({
          name: 'file-upload-queue',
        }),
      ]
    }).compile();

    resolver = module.get<UploadResolver>(UploadResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
