import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from 'src/modules/project/presentation/project.controller';
import { ProjectReadByIdUseCase, ProjectReadEjemploUseCase, ProjectPopulateUseCase } from 'src/modules/project/application/project.usecase';
import { RoleAuthTokenGuard } from 'src/shareds/role-auth/presentation/role-auth-token.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ProjectBase } from '@skrteeeeee/profile-domain';
import { DBBase } from 'src/dynamic.types';

describe('ProjectController', () => {
  let controller: ProjectController;
  let readEjemploUseCase: jest.Mocked<ProjectReadEjemploUseCase>;
  let readByIdUseCase: jest.Mocked<ProjectReadByIdUseCase>;
  let populateUseCase: jest.Mocked<ProjectPopulateUseCase>;

  const mockProject: ProjectBase & DBBase = {
    id: '679ceeaf0e064c75096f308e',
    nameId: 'test-project',
    openSource: 'https://github.com/test',
    operative: 'https://test.com',
    ejemplo: true,
    image: '/test.png',
    icon: 'Rocket',
    title: { es: 'Proyecto de prueba', en: 'Test project', ca: 'Projecte de prova', de: 'Testprojekt' },
    desc: { es: 'Descripción', en: 'Description', ca: 'Descripció', de: 'Beschreibung' },
    lilDesc: { es: 'Breve', en: 'Brief', ca: 'Breu', de: 'Kurz' },
    time: [],
    keys: [],
    techs: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    readEjemploUseCase = {
      execute: jest.fn(),
    } as any;

    readByIdUseCase = {
      execute: jest.fn(),
    } as any;

    populateUseCase = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        { provide: ProjectReadEjemploUseCase, useValue: readEjemploUseCase },
        { provide: ProjectReadByIdUseCase, useValue: readByIdUseCase },
        { provide: ProjectPopulateUseCase, useValue: populateUseCase },
      ],
    })
      .overrideGuard(RoleAuthTokenGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('readEjemplo', () => {
    it('should return example projects', async () => {
      const mockProjects = [mockProject];
      readEjemploUseCase.execute.mockResolvedValue(mockProjects);

      const result = await controller.readEjemplo();

      expect(result).toEqual(mockProjects);
      expect(readEjemploUseCase.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('readById', () => {
    it('should return a project by id', async () => {
      readByIdUseCase.execute.mockResolvedValue(mockProject);

      const result = await controller.readById('679ceeaf0e064c75096f308e');

      expect(result).toEqual(mockProject);
      expect(readByIdUseCase.execute).toHaveBeenCalledWith('679ceeaf0e064c75096f308e');
      expect(readByIdUseCase.execute).toHaveBeenCalledTimes(1);
    });

    it('should return null when project not found', async () => {
      readByIdUseCase.execute.mockResolvedValue(null);

      const result = await controller.readById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('populate', () => {
    it('should populate projects', async () => {
      const data = [mockProject] as any;
      populateUseCase.execute.mockResolvedValue(data);

      const result = await controller.populate(data);

      expect(result).toEqual(data);
      expect(populateUseCase.execute).toHaveBeenCalledWith(data);
    });
  });
});
