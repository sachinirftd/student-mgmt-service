
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { request, gql } from 'graphql-request';
import { identity } from 'rxjs';
import { CreateStudentInput } from './dto/input/create.student.input';
import { DeleteStudentInput } from './dto/input/delete.student.input';
import { UpdateStudentInput } from './dto/input/update.student.input';
import { Student } from './entity/student.entity';

@Injectable()
export class StudentService {
  endPoint = 'http://localhost:5000/graphql';

  constructor() { }
  async saveStudent(createStudent: CreateStudentInput): Promise<Student> {

    const mutation = `mutation CreateStudent($createStudent: StudentInput!) {
            createStudent(input: { student: $createStudent }) {
                  student {
                id
                name
                age
                dob
              }
            }
          }`

    return request(this.endPoint, mutation, {
      createStudent: createStudent
    }).then((data) => {
      return data.createStudent.student;
    }, (error) => {
      console.log(error);
    });
    //const res = axios.post(this.endPoint, {
      //     query: mutation,
      //     variables: { createStudent: createStudent }
      // }).then((response) => {
      //     console.log(response.status, "RESPONSE");
      // }, (error) => {
      //     console.log(error);
      // });
      // console.log(res, "RES")
      // return res;
    }

    async getAllStudents(): Promise < Student[] > {
      const query = gql`query MyQuery {
            allStudents {
              nodes {
                id
                name
                age
                email
                dob
              }}}`

        return request(this.endPoint, query).then((data) => {
        return data.allStudents.nodes;
      });
    }

    async updateStudent(updateStudent: UpdateStudentInput): Promise < number > {
      const mutation = `mutation UpdateStudentById($id: Int!, $updateStudent: StudentPatch!) {
            updateStudentById(input: { id: $id, studentPatch: $updateStudent }) {
                student {
                    id
                  }
            }
          }`

        return request(this.endPoint, mutation, {
        id: updateStudent.id,
        updateStudent: updateStudent
      }).then((data) => {
        return data.updateStudentById.student.id;
      });
    }

    async deleteStudent(deleteStudent: DeleteStudentInput): Promise < number > {
      const mutation = `mutation DeleteStudentById($id: Int!){
            deleteStudentById(input: {id: $id}) {
                student {
                    id
                  }
            }
          }`

          return request(this.endPoint, mutation, {
        id: deleteStudent.id,
      }).then((data) => {
        return data.deleteStudentById.student.id;
      });
    }
}
