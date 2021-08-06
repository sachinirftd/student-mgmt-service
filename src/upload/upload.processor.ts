import { Processor, Process } from "@nestjs/bull";
import { Job } from "bull";
import { Student } from "src/student/entity/student.entity";
const excelToJson = require('convert-excel-to-json');
const xlsxFile = require('read-excel-file/node');
const XLSX = require('xlsx');
import xlsx from 'node-xlsx';
import axios from "axios";
import { request } from "graphql-request";

@Processor('file-upload-queue')
export class UploadProcessor {

    endPoint = 'http://localhost:5000/graphql';

    students: Student[] = [];
    stud: Student;

    @Process('upload')
    async readOperationJob(job: Job<any>) {
        console.log("Job Received:  ", job.id);
        let insertedStudents: Student[] = [];

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
                    age: this.calculateAge(obj.Dob),
                    dob: obj.Dob,
                    email: obj.Email
                };
                this.students.push(this.stud);
                // return obj;
            });
            console.log(this.students, '  ARRAY')
        });

        this.students.forEach(student => {
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
                insertedStudents.push(data.createStudent.student)
                return data.createStudent.student;
            }, (error) => {
                () => error;
            });
        }
        );
        console.log('STUDENT  ARRAY')
    }

    calculateAge(birthday: Date) { // birthday is a date
        var ageDifMs = Date.now() - birthday.getTime();
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }
}