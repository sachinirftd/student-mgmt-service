import { InjectQueue } from '@nestjs/bull';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Queue } from 'bull';
import { createWriteStream } from 'fs';
import { FileUpload, GraphQLUpload } from "graphql-upload";

@Resolver('upload')
export class UploadResolver {

    // constructor( private uploadService: UploadService){}
    constructor(@InjectQueue('file-upload-queue') private fileUploadQueue: Queue) { }

    @Mutation(() => Boolean)
    async uploadFile(@Args({ name: 'file', type: () => GraphQLUpload })
    {
        createReadStream,
        filename
    }: FileUpload): Promise<boolean> {
        return new Promise(async (resolve, reject) =>
            createReadStream()
                .pipe(createWriteStream(`./uploads/${filename}`))
                .on('finish', async () => {
                    const job = await this.fileUploadQueue.add('upload', {
                        filename
                    });
                    console.log(job.id, 'job init')
                    resolve(true);
                })
                .on('error', () => reject(false))
        );
    }

    @Query(() => String)
    sayHello(): string {
        return 'Hello World!';
    }
}
