import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
import { CreateStudentInput } from './dto/input/create.student.input';
import { DeleteStudentInput } from './dto/input/delete.student.input';
import { UpdateStudentInput } from './dto/input/update.student.input';
import { StudentResolver } from './student.resolver';
import { StudentService } from './student.service';

describe('StudentService', () => {

  let service: StudentService;
  const mockService = {
    saveStudent: jest.fn(dto => {
      return {
        data: {
          createStudent: {
            __typename: 'Student'
          }
        }
      }
    }),

    updateStudent: jest.fn(dto => {
      return {
        data: {
          updateStudent: {
            __typename: 'Student'
          }
        }
      }
    }),

    deleteStudent: jest.fn(dto => {
      return {
        data: {
          updateStudent: {
            __typename: 'Student'
          }
        }
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService, StudentResolver],
    }).overrideProvider(StudentService).useValue(mockService).compile();

    service = module.get<StudentService>(StudentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create new student', () => {
    const dto: CreateStudentInput = {
      id: 1,
      name: "TestOne",
      age: 20,
      dob: new Date("2000-12-12"),
      email: "sach@123.com"
    }

    expect(service.saveStudent(dto)).toEqual({
      data: {
        createStudent: {
          __typename: 'Student'
        }
      }
    });
    expect(mockService.saveStudent).toHaveBeenCalledWith(dto);
  });

  it('should update student', () => {
    const dto: UpdateStudentInput = {
      id: 1,
      name: "TestOne",
      age: 20,
      dob: new Date("2000-12-12"),
      email: "sach@123.com"
    }
    expect(service.updateStudent(dto)).toEqual({
      data: {
        updateStudent: {
          __typename: 'Student'
        }
      }
    });
    expect(mockService.updateStudent).toHaveBeenCalledWith(dto);
  });

  it('should delete student', () => {
    const dto: DeleteStudentInput = {
      id: 1
    }
    expect(service.deleteStudent(dto)).toEqual({
      data: {
        deleteStudent: {
          __typename: 'Student'
        }
      }
    });
    expect(mockService.updateStudent).toHaveBeenCalledWith(dto);
  });

});