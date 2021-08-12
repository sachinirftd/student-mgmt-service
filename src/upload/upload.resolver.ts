import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { UploadService } from './upload.service';

@Resolver('upload')
export class UploadResolver {

    constructor(private uploadService: UploadService) { }

    @Mutation(() => Boolean)
    async uploadFile(@Args({ name: 'file', type: () => GraphQLUpload })
    {
        createReadStream,
        filename
    }: FileUpload) {
        return this.uploadService.uploadFile(filename, createReadStream);
    }

        // this.logger.log("req recieved to file upload", filename);
        // const chunks = [];
        // for await (let chunk of createReadStream()) {
        //     chunks.push(chunk)
        // }

        // const buffer  = Buffer.concat(chunks);
        // console.log(buffer, "BUFFER")
        // return this.studentService.createStudentBatch(filename, buffer);



        // const stream = createReadStream();
        // // Store the file in the filesystem.
        // await new Promise((resolve, reject) => {
        //     // Create a stream to which the upload will be written.
        //     const writeStream = createWriteStream(`./uploads/${filename}`);

        //     // When the upload is fully written, resolve the promise.
        //     writeStream.on('finish', resolve);

        //     // If there's an error writing the file, remove the partially written file
        //     // and reject the promise.
        //     writeStream.on('error', (error) => {
        //         unlink(`./uploads/${filename}`, () => {
        //             reject(error);
        //         });
        //     });

        //     // In Node.js <= v13, errors are not automatically propagated between piped
        //     // streams. If there is an error receiving the upload, destroy the write
        //     // stream with the corresponding error.
        //     stream.on('error', (error) => writeStream.destroy(error));

        //     // Pipe the upload into the write stream.
        //     stream.pipe(writeStream);
        // });

        // return true;
    // }

    // @Query(() => String)
    // sayHello(): string {
    //     return 'Hello World!';
    // }
}
