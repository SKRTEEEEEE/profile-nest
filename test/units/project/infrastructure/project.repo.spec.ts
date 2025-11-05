import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseProjectRepo } from '../../../../src/modules/project/infrastructure/project.repo';

describe('MongooseProjectRepo', () => {
  let repo: MongooseProjectRepo;
  let model: jest.Mocked<Model<any>>;

  const mockProject = {
    _id: 'project-123',
    name: 'Test Project',
    description: 'A test project',
    technologies: ['typescript', 'nodejs'],
    githubUrl: 'https://github.com/user/test-project',
    createdAt: new Date(),
    updatedAt: new Date(),
    toObject: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const mockModel = {
      create: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongooseProjectRepo,
        {
          provide: getModelToken('Project'),
          useValue: mockModel,
        },
      ],
    }).compile();

    repo = module.get<MongooseProjectRepo>(MongooseProjectRepo);
    model = module.get(getModelToken('Project'));
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should create a project successfully', async () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project',
        technologies: ['typescript', 'nodejs'],
        githubUrl: 'https://github.com/user/test-project',
      };

      model.create.mockResolvedValue(mockProject as any);

      const result = await repo.create(projectData);

      expect(result).toEqual(mockProject);
      expect(model.create).toHaveBeenCalledWith(projectData);
    });
  });

  describe('readById', () => {
    it('should find project by id', async () => {
      const projectId = 'project-123';
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProject),
      } as any);

      const result = await repo.readById(projectId);

      expect(result).toEqual(mockProject);
      expect(model.findById).toHaveBeenCalledWith(projectId);
    });

    it('should return null if project not found', async () => {
      const projectId = 'non-existent';
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await repo.readById(projectId);

      expect(result).toBeNull();
      expect(model.findById).toHaveBeenCalledWith(projectId);
    });
  });

  describe('readOne', () => {
    it('should find one project by filter', async () => {
      const filter = { name: 'Test Project' };
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProject),
      } as any);

      const result = await repo.readOne(filter);

      expect(result).toEqual(mockProject);
      expect(model.findOne).toHaveBeenCalledWith(filter);
    });
  });

  describe('updateById', () => {
    it('should update project by id', async () => {
      const updateProps = {
        id: 'project-123',
        updateData: { name: 'Updated Project' },
      };
      const updatedProject = { ...mockProject, name: 'Updated Project' };
      
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedProject),
      } as any);

      const result = await repo.updateById(updateProps);

      expect(result).toEqual(updatedProject);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        updateProps.id,
        updateProps.updateData,
        { new: true }
      );
    });
  });

  describe('read', () => {
    it('should find all projects', async () => {
      const projects = [mockProject, { ...mockProject, _id: 'project-456' }];
      model.find.mockResolvedValue(projects as any);

      const result = await repo.read({});

      expect(result).toEqual(projects);
      expect(model.find).toHaveBeenCalledWith({});
    });

    it('should find projects with filter', async () => {
      const filter = { technologies: 'typescript' };
      const projects = [mockProject];
      model.find.mockResolvedValue(projects as any);

      const result = await repo.read(filter);

      expect(result).toEqual(projects);
      expect(model.find).toHaveBeenCalledWith(filter);
    });
  });

  describe('delete', () => {
    it('should delete project by filter', async () => {
      const deleteProps = {
        filter: { name: 'Test Project' },
      };

      model.findOneAndDelete = jest.fn().mockResolvedValue(mockProject);

      const result = await repo.delete(deleteProps);

      expect(result).toEqual([mockProject]);
      expect(model.findOneAndDelete).toHaveBeenCalledWith(deleteProps.filter);
    });
  });
});
