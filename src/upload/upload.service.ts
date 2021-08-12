
import { Injectable } from '@nestjs/common';
import { Student } from './entity/student.entity';
const xlsxFile = require('read-excel-file/node');
import { createWriteStream } from 'fs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UploadService {

    endPoint = process.env.DB_CONNECTION;
    students: Student[] = [];
    stud: Student;

    constructor(@InjectQueue('file-upload-queue') private fileUploadQueue: Queue) { }

    async uploadFile(filename: string, createReadStream: any): Promise<Boolean> {

        return new Promise(async (resolve, reject) =>
            await createReadStream()
                .pipe(createWriteStream(`./uploads/${filename}`))
                .on('finish', async () => {
                     await this.fileUploadQueue.add('upload', {
                        filename
                    });
                    resolve(true);
                })
                .on('error', () => reject(false))
        );
    }
}
