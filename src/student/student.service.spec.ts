import { Test, TestingModule } from '@nestjs/testing';
import { DeleteStudentInput } from './dto/input/delete.student.input';
import { StudentResolver } from './student.resolver';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentService, StudentResolver],
    }).compile();

    service = module.get<StudentService>(StudentService);
  });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });


  // describe('getAllStudents', () => {
    it('should return all students', async () => {
      jest.spyOn(service, 'getAllStudents');
      expect((await service.getAllStudents()).length).toBeGreaterThan(0);
    });

    it('should delete student from list', async () => {
      const deleteStudent: DeleteStudentInput = {
        id: 3
      };
      jest.spyOn(service, 'deleteStudent');
      expect(await service.deleteStudent(deleteStudent)).toBeGreaterThan(0);
    })


  // });
});