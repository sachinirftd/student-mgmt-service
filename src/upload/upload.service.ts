
import { Injectable } from '@nestjs/common';
import { Student } from 'src/student/entity/student.entity';
const xlsxFile = require('read-excel-file/node');
import { request } from "graphql-request";
import { createWriteStream } from 'fs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class UploadService {

    endPoint = 'http://localhost:5000/graphql';
    students: Student[] = [];
    stud: Student;

    constructor(@InjectQueue('file-upload-queue') private fileUploadQueue: Queue) { }

    async uploadFile(filename: string, createReadStream: any): Promise<Boolean> {

        return new Promise(async (resolve, reject) =>
            await createReadStream()
                .pipe(createWriteStream(`./uploads/${filename}`))
                .on('finish', async () => {
                    const job = await this.fileUploadQueue.add('upload', {
                        filename
                    });
                    resolve(true);
                })
                .on('error', () => reject(false))
                
        );

    }

}
