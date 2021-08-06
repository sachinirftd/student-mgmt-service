import { Processor, Process, OnGlobalQueueCompleted, InjectQueue, OnQueueCompleted, OnQueueFailed, OnQueueError } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { Student } from "src/student/entity/student.entity";
const excelToJson = require('convert-excel-to-json');
const xlsxFile = require('read-excel-file/node');
const XLSX = require('xlsx');
import xlsx from 'node-xlsx';
import axios from "axios";
import { request } from "graphql-request";

@Processor('file-upload-queue')
export class UploadConsumer {

    endPoint = 'http://localhost:5000/graphql';
    students: Student[] = [];
    stud: Student;

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
                // console.log(obj); // Display the array of objects on the console
                // this.students.push(obj);

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
            console.log(this.students, '  ARRAY')
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
            // const res = axios.post(this.endPoint, {
            //     query: mutation,
            //     variables: { createStudent: student }
            // }).then((response) => {
            //     console.log(response.data);
            // }, (error) => {
            //     console.log(error);
            // });
            // return res;

            return request(this.endPoint, mutation, {
                createStudent: student
            }).then((data) => {
                // insertedStudents.push(data.createStudent.student)
                console.log(data, "Data")
                return true;
            }, (error) => {
                console.log(error, "ERROR");
                // () => error;
            });
        }
        );
        console.log('STUDENT  ARRAY')
        console.log(returnResult, "RETURN RESULT")
        return returnResult;
    }

    @OnQueueCompleted()
    async onCompleted(jobId: number, result: any) {
      const job = await this.fileUploadQueue.getJob(jobId);
      console.log(' on completed: job ', job, ' -> result: ', result);
    }


    @OnQueueFailed()
    async onFailed(jobId: number, result: any) {
      const job = await this.fileUploadQueue.getJob(jobId);
      console.log('on failed: job ', job, ' -> result: ', result);
    }

    @OnQueueError()
    async onError(jobId: number, result: any) {
      const job = await this.fileUploadQueue.getJob(jobId);
      console.log(' on Error: job ', jobId, ' -> result: ', result);
    }

    calculateAge(birthday: Date) { 
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); 
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}