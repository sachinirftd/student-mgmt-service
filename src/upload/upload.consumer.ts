import { Processor, Process, OnGlobalQueueCompleted, InjectQueue, OnQueueCompleted, OnQueueFailed, OnQueueError } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { Student } from "src/student/entity/student.entity";
const excelToJson = require('convert-excel-to-json');
const xlsxFile = require('read-excel-file/node');
const XLSX = require('xlsx');
import { request } from "graphql-request";
import * as socketClusterClient from 'socketcluster-client';
import { Logger } from "@nestjs/common";

@Processor('file-upload-queue')
export class UploadConsumer {

    endPoint = 'http://localhost:5000/graphql';
    students: Student[] = [];
    stud: Student;

     socket = socketClusterClient.create({
        hostname: 'localhost',
        port: 8000
      });

      myChannel = this.socket.subscribe('myChannel');


    constructor(@InjectQueue('file-upload-queue') private fileUploadQueue: Queue){}


    @Process('upload')
    async readOperationJob(job: Job<any>) {
        console.log("Job Received:  ", job.id);
        let insertedStudents: Student[] = [];
        this.students = [];

        await xlsxFile('./uploads/Data.xlsx').then((rows) => {
            const columnNames = rows.shift(); // Separate first row with column names
            const objs = rows.map((row) => { // Map the rest of the rows into objects
                const obj: any = {}; // Create object literal for current row
                row.forEach((cell, i) => {
                    obj[columnNames[i]] = cell; // Use index from current cell to get column name, add current cell to new object
                });

                this.stud = {
                    id: obj.Id,
                    name: obj.Name,
                    email: obj.Email,
                    age: this.calculateAge(obj.Dob),
                    dob: obj.Dob                   
                };
                this.students.push(this.stud);
                // return obj;
            });
        });
       const returnResult = this.students.map(student => {
            const mutation = `mutation CreateStudent($createStudent: StudentInput!){
                createStudent(input: {student: $createStudent}){
                    student {
                        id
                        name
                        age
                        dob
                      }
                }
            }`

            return request(this.endPoint, mutation, {
                createStudent: student
            }).then((data) => {
                // insertedStudents.push(data.createStudent.student)
                return true;
            }, (error) => {
                // () => error;
            });
        }
        );
        return returnResult;
    }

    @OnQueueCompleted()
    async onCompleted(jobId: number) {
      const job = await this.fileUploadQueue.getJob(jobId);
      (async () => {
        // Publish data to the channel from the socket and await for
        // the message to reach the server.
        try {
            await this.socket.invokePublish('myChannel', 'Success');
        } catch (error) {
          // Handle error.
        }
      })();
    }


    @OnQueueFailed()
    async onFailed(jobId: number) {
      const job = await this.fileUploadQueue.getJob(jobId);
      (async () => {
        // Publish data to the channel from the socket and await for
        // the message to reach the server.
        try {
            await this.socket.invokePublish('myChannel', 'Failed');
        } catch (error) {
          // Handle error.
        }
      })();
    }

    @OnQueueError()
    async onError(jobId: number) {
      const job = await this.fileUploadQueue.getJob(jobId);
      (async () => {
        // Publish data to the channel from the socket and await for
        // the message to reach the server.
        try {
            await this.socket.invokePublish('myChannel', 'Error');
        } catch (error) {
          // Handle error.
        }
      })();
    }

    calculateAge(birthday: Date) { 
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); 
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}