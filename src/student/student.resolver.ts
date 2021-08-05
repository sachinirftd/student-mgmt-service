import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Student } from './entity/student.entity';
import { StudentService } from './student.service';
import { CreateStudentInput } from './dto/input/create.student.input'
import { UpdateStudentInput } from './dto/input/update.student.input';
import { DeleteStudentInput } from './dto/input/delete.student.input';

@Resolver(() => Student)
export class StudentResolver {
    constructor(private readonly studentService: StudentService) { }

    @Mutation(()=> Student) //bool denoted return type from the query
    async saveStudent(@Args('createStudentInput') createStudentInput: CreateStudentInput): Promise<Student> {
        console.log('hits the resolver in create');
        return this.studentService.saveStudent(createStudentInput);
    }
    @Query(() => [Student], { name: 'user', nullable: 'itemsAndList' }) //name=> name for the query
    async getAllStudents(): Promise<Student[]> {
        return this.studentService.getAllStudents();
    }

    @Mutation(() => Number) //bool denoted return type from the query
    async updateStudent(@Args('updateStudentInput') updateStudentInput: UpdateStudentInput): Promise<number> {
        return this.studentService.updateStudent(updateStudentInput);
    }

    @Mutation(() => Number) //bool denoted return type from the query
    async deleteStudent(@Args('deleteStudentInput') deleteStudentInput: DeleteStudentInput): Promise<number> {
        return this.studentService.deleteStudent(deleteStudentInput);
    }
}
