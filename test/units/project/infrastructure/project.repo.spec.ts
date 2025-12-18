import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseProjectRepo } from '../../../../src/modules/project/infrastructure/project.repo';
import { ProjectBase } from '@skrteeeeee/profile-domain';
import { NativeLoggerService } from '../../../../src/shareds/presentation/native-logger.service';

describe('MongooseProjectRepo', () => {
  let repo: MongooseProjectRepo;
  let model: jest.Mocked<Model<ProjectBase>>;
  const now = new Date();

  const mockMongoDoc = () => ({
    toObject: jest.fn().mockReturnValue({
      _id: { toString: () => 'project-123' },
      createdAt: now,
      updatedAt: now,
      nameId: 'project-123',
      ejemplo: true,
      openSource: null,
      operative: null,
      image: null,
      icon: 'zap' as any,
      title: { es: 'titulo', en: 'title', ca: 'titol', de: 'titel' },
      desc: { es: 'desc', en: 'desc', ca: 'desc', de: 'desc' },
      lilDesc: { es: 'desc', en: 'desc', ca: 'desc', de: 'desc' },
      time: [],
      keys: [],
      techs: [],
    }),
  });

  beforeEach(async () => {
    const mockModel = {
      insertMany: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
    } as Partial<jest.Mocked<Model<ProjectBase>>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongooseProjectRepo,
        {
          provide: getModelToken('Project'),
          useValue: mockModel,
        },
        {
          provide: NativeLoggerService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    repo = module.get<MongooseProjectRepo>(MongooseProjectRepo);
    model = module.get(getModelToken('Project')) as jest.Mocked<Model<ProjectBase>>;

    jest.spyOn<any, any>(repo as any, 'documentToPrimary').mockImplementation(() => ({
      id: 'project-123',
      nameId: 'project-123',
    }));
    jest.spyOn<any, any>(repo as any, 'resArrCheck').mockReturnValue({});
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('populate', () => {
    it('should insert many docs and return primaries', async () => {
      const docs = [{ nameId: 'project-1' } as ProjectBase];
      const mockDoc = mockMongoDoc();
      model.insertMany.mockResolvedValue([mockDoc] as any);

      const result = await repo.populate(docs);

      expect(model.insertMany).toHaveBeenCalledWith(docs);
      expect(result).toEqual([{ id: 'project-123', nameId: 'project-123' }]);
    });
  });

  describe('readEjemplo', () => {
    it('should read ejemplo projects and map to primary', async () => {
      const mockDoc = mockMongoDoc();
      (model.find as jest.Mock).mockResolvedValue([mockDoc] as any);

      const result = await repo.readEjemplo();

      expect(model.find).toHaveBeenCalledWith({ ejemplo: true });
      expect(result).toEqual([{ id: 'project-123', nameId: 'project-123' }]);
    });

    it('should throw when find fails', async () => {
      (model.find as jest.Mock).mockRejectedValue(new Error('db error'));

      await expect(repo.readEjemplo()).rejects.toThrow();
    });
  });

  describe('readById', () => {
    it('should return project when found', async () => {
      const mockDoc = mockMongoDoc();
      (model.findById as jest.Mock).mockResolvedValue(mockDoc as any);

      const result = await repo.readById('project-123');

      expect(model.findById).toHaveBeenCalledWith('project-123');
      expect(result).toEqual({ id: 'project-123', nameId: 'project-123' });
    });

    it('should return null if not found', async () => {
      (model.findById as jest.Mock).mockResolvedValue(null);

      const result = await repo.readById('missing');

      expect(result).toBeNull();
    });
  });
});
