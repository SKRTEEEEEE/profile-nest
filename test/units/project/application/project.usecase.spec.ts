import { Test, TestingModule } from '@nestjs/testing';
import { 
  ProjectReadByIdUseCase, 
  ProjectReadEjemploUseCase,
  ProjectPopulateUseCase 
} from 'src/modules/project/application/project.usecase';
import { ProjectInterface } from 'src/modules/project/application/project.interface';
import { PROJECT_REPOSITORY } from 'src/modules/tokens';
import { ProjectBase } from '@skrteeeeee/profile-domain';
import { DBBase } from 'src/dynamic.types';
import { NativeLoggerService } from 'src/shareds/presentation/native-logger.service';

describe('ProjectReadByIdUseCase', () => {
  let useCase: ProjectReadByIdUseCase;
  let repository: jest.Mocked<ProjectInterface>;

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
    repository = {
      populate: jest.fn(),
      readEjemplo: jest.fn(),
      readById: jest.fn(),
    } as any;

    const mockLogger = {
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      setCorrelationId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectReadByIdUseCase,
        { provide: PROJECT_REPOSITORY, useValue: repository },
        { provide: NativeLoggerService, useValue: mockLogger },
      ],
    }).compile();

    useCase = module.get<ProjectReadByIdUseCase>(ProjectReadByIdUseCase);
  });

  describe('execute', () => {
    it('should return a project when found', async () => {
      repository.readById.mockResolvedValue(mockProject);

      const result = await useCase.execute('679ceeaf0e064c75096f308e');

      expect(result).toEqual(mockProject);
      expect(repository.readById).toHaveBeenCalledWith('679ceeaf0e064c75096f308e');
      expect(repository.readById).toHaveBeenCalledTimes(1);
    });

    it('should return null when project not found', async () => {
      repository.readById.mockResolvedValue(null);

      const result = await useCase.execute('non-existent-id');

      expect(result).toBeNull();
      expect(repository.readById).toHaveBeenCalledWith('non-existent-id');
    });

    it('should throw error when repository fails', async () => {
      repository.readById.mockRejectedValue(new Error('Database error'));

      await expect(useCase.execute('test-id')).rejects.toThrow('Database error');
    });
  });
});

describe('ProjectReadEjemploUseCase', () => {
  let useCase: ProjectReadEjemploUseCase;
  let repository: jest.Mocked<ProjectInterface>;
  let mockLogger: any;

  beforeEach(async () => {
    repository = {
      populate: jest.fn(),
      readEjemplo: jest.fn(),
      readById: jest.fn(),
    } as any;

    mockLogger = {
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      setCorrelationId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectReadEjemploUseCase,
        { provide: PROJECT_REPOSITORY, useValue: repository },
        { provide: NativeLoggerService, useValue: mockLogger },
      ],
    }).compile();

    useCase = module.get<ProjectReadEjemploUseCase>(ProjectReadEjemploUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should return projects from repository', async () => {
    const mockProjects = [{ id: '1' }, { id: '2' }] as any;
    repository.readEjemplo.mockResolvedValue(mockProjects);

    const result = await useCase.execute();

    expect(result).toEqual(mockProjects);
    expect(repository.readEjemplo).toHaveBeenCalledTimes(1);
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('should warn when no projects found', async () => {
    repository.readEjemplo.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      'No se encontraron proyectos en la DB',
      ProjectReadEjemploUseCase.name,
    );
  });
});

describe('ProjectPopulateUseCase', () => {
  let useCase: ProjectPopulateUseCase;
  let repository: jest.Mocked<ProjectInterface>;

  beforeEach(async () => {
    repository = {
      populate: jest.fn(),
      readEjemplo: jest.fn(),
      readById: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectPopulateUseCase,
        { provide: PROJECT_REPOSITORY, useValue: repository },
      ],
    }).compile();

    useCase = module.get<ProjectPopulateUseCase>(ProjectPopulateUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  it('should populate projects', async () => {
    const projectsData = [
      { nameId: 'test', name: 'Test Project' },
    ] as any;
    const populatedProjects = [{ id: '1', nameId: 'test' }] as any;
    
    repository.populate.mockResolvedValue(populatedProjects);

    const result = await useCase.execute(projectsData);

    expect(result).toEqual(populatedProjects);
    expect(repository.populate).toHaveBeenCalledWith(projectsData);
  });

  it('should handle empty projects array', async () => {
    repository.populate.mockResolvedValue([]);

    const result = await useCase.execute([]);

    expect(result).toEqual([]);
    expect(repository.populate).toHaveBeenCalledWith([]);
  });
});
