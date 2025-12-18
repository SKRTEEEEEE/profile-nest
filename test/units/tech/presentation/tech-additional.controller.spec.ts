import { Test, TestingModule } from '@nestjs/testing';
import { TechController } from '../../../../src/modules/tech/presentation/tech.controller';
import { TechReadUseCase } from '../../../../src/modules/tech/application/tech-read.usecase';
import { TechOctokitCreateRepo } from '../../../../src/modules/tech/infrastructure/tech-octokit/create.repo';
import { TechOctokitActualizarGithubRepo, ActualizarGithubType } from '../../../../src/modules/tech/infrastructure/tech-octokit/actualizar.repo';
import { TechOctokitUpdateRepo } from '../../../../src/modules/tech/infrastructure/tech-octokit/update.repo';
import { TechFindDeleteRepo } from '../../../../src/modules/tech/infrastructure/delete.repo';
import { ReadAllParams, ActualizarGithubParams, TechFormCategory } from '@skrteeeeee/profile-domain';
import { InputParseError } from '@skrteeeeee/profile-domain';
import { ThrottlerGuard } from '@nestjs/throttler';

describe('TechController', () => {
  let controller: TechController;
  let mockTechReadService: jest.Mocked<TechReadUseCase>;
  let mockTechOctokitCreateRepo: jest.Mocked<TechOctokitCreateRepo>;
  let mockTechOctokitActualizarGithubRepo: jest.Mocked<TechOctokitActualizarGithubRepo>;
  let mockTechOctokitUpdateRepo: jest.Mocked<TechOctokitUpdateRepo>;
  let mockTechFindAndDeleteRepo: jest.Mocked<TechFindDeleteRepo>;

  const intlDesc = { es: 'desc', en: 'desc', ca: 'desc', de: 'desc' };
  const mockTechData = {
    id: 'tech-123',
    nameId: 'javascript',
    nameBadge: 'JavaScript',
    color: '#f7df1e',
    web: 'https://developer.mozilla.org',
    preferencia: 50,
    experiencia: 60,
    afinidad: 70,
    img: null,
    desc: intlDesc,
    usoGithub: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any;

  const mockFullTechData = {
    nameId: 'javascript',
    nameBadge: 'JavaScript',
    color: '#f7df1e',
    web: 'https://developer.mozilla.org',
    preferencia: 50,
    experiencia: 60,
    afinidad: 70,
    img: null,
    desc: intlDesc,
    usoGithub: 5,
    valueAfin: 'high',
    valueExp: 'high',
    valueUso: 'high',
  };

  beforeEach(async () => {
    mockTechReadService = {
      readAll: jest.fn(),
      readAllCat: jest.fn(),
      readAllC: jest.fn(),
      readAllFlatten: jest.fn(),
      flattenTechs: jest.fn(),
      getColorByRange: jest.fn(),
      getGithubUsoByRange: jest.fn(),
      techRepository: {} as any,
    } as unknown as jest.Mocked<TechReadUseCase>;

    mockTechOctokitCreateRepo = {
      create: jest.fn(),
    } as unknown as jest.Mocked<TechOctokitCreateRepo>;

    mockTechOctokitActualizarGithubRepo = {
      actualizar: jest.fn(),
    } as unknown as jest.Mocked<TechOctokitActualizarGithubRepo>;

    mockTechOctokitUpdateRepo = {
      update: jest.fn(),
    } as unknown as jest.Mocked<TechOctokitUpdateRepo>;

    mockTechFindAndDeleteRepo = {
      findAndDelete: jest.fn(),
    } as unknown as jest.Mocked<TechFindDeleteRepo>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechController],
      providers: [
        { provide: TechReadUseCase, useValue: mockTechReadService },
        { provide: TechOctokitCreateRepo, useValue: mockTechOctokitCreateRepo },
        { provide: TechOctokitActualizarGithubRepo, useValue: mockTechOctokitActualizarGithubRepo },
        { provide: TechOctokitUpdateRepo, useValue: mockTechOctokitUpdateRepo },
        { provide: TechFindDeleteRepo, useValue: mockTechFindAndDeleteRepo },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TechController>(TechController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('delete', () => {
    it('should delete tech by nameId', async () => {
      mockTechFindAndDeleteRepo.findAndDelete.mockResolvedValue(mockTechData);

      const result = await controller.delete('javascript');

      expect(result).toEqual(mockTechData);
      expect(mockTechFindAndDeleteRepo.findAndDelete).toHaveBeenCalledWith('javascript');
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed');
      mockTechFindAndDeleteRepo.findAndDelete.mockRejectedValue(error);

      await expect(controller.delete('nonexistent')).rejects.toThrow('Delete failed');
    });
  });

  describe('readAll', () => {
    it('should read all techs in db format', async () => {
      const mockData = [mockTechData];
      mockTechReadService.readAll.mockResolvedValue(mockData);

      const result = await controller.readAll(ReadAllParams.Db);

      expect(result).toEqual(mockData);
      expect(mockTechReadService.readAll).toHaveBeenCalled();
    });

    it('should read all techs in category format', async () => {
      const mockData = { dispoFw: [{ name: 'react' }], dispoLeng: [{ name: 'javascript' }] };
      mockTechReadService.readAllCat.mockResolvedValue(mockData);

      const result = await controller.readAll(ReadAllParams.Category);

      expect(result).toEqual(mockData);
      expect(mockTechReadService.readAllCat).toHaveBeenCalled();
    });

    it('should read all techs in full format', async () => {
      const mockData = {
        techs: [mockTechData],
        flattenTechs: [mockFullTechData],
        dispoFw: [{ name: 'react' }],
        dispoLeng: [{ name: 'javascript' }],
      };
      mockTechReadService.readAllC.mockResolvedValue(mockData);

      const result = await controller.readAll(ReadAllParams.Full);

      expect(result).toEqual(mockData);
      expect(mockTechReadService.readAllC).toHaveBeenCalled();
    });

    it('should read all techs in flatten format', async () => {
      const mockData = [mockFullTechData];
      mockTechReadService.readAllFlatten.mockResolvedValue(mockData);

      const result = await controller.readAll(ReadAllParams.Flatten);

      expect(result).toEqual(mockData);
      expect(mockTechReadService.readAllFlatten).toHaveBeenCalled();
    });
  });

  describe('actualizarGithub', () => {
    it('should update all github files', async () => {
      mockTechOctokitActualizarGithubRepo.actualizar.mockResolvedValue(undefined);

      const result = await controller.actualizarGithub(ActualizarGithubParams.All);

      expect(result).toBeUndefined();
      expect(mockTechOctokitActualizarGithubRepo.actualizar).toHaveBeenCalledWith({
        type: ActualizarGithubType.all,
      });
    });

    it('should update json github file only', async () => {
      mockTechOctokitActualizarGithubRepo.actualizar.mockResolvedValue(undefined);

      const result = await controller.actualizarGithub(ActualizarGithubParams.Json);

      expect(result).toBeUndefined();
      expect(mockTechOctokitActualizarGithubRepo.actualizar).toHaveBeenCalledWith({
        type: ActualizarGithubType.json,
      });
    });

    it('should update markdown github file only', async () => {
      mockTechOctokitActualizarGithubRepo.actualizar.mockResolvedValue(undefined);

      const result = await controller.actualizarGithub(ActualizarGithubParams.Md);

      expect(result).toBeUndefined();
      expect(mockTechOctokitActualizarGithubRepo.actualizar).toHaveBeenCalledWith({
        type: ActualizarGithubType.md,
      });
    });

    it('should throw InputParseError for invalid type', async () => {
      await expect(controller.actualizarGithub('invalid' as any))
        .rejects.toThrow(InputParseError);
    });
  });

  describe('update', () => {
    it('should update tech successfully', async () => {
      const techFormDto = {
        nameId: 'javascript',
        nameBadge: 'JavaScript Updated',
        color: '#000000',
      };

      mockTechOctokitUpdateRepo.update.mockResolvedValue(mockTechData);

      const result = await controller.update(techFormDto);

      expect(result).toEqual(mockTechData);
      expect(mockTechOctokitUpdateRepo.update).toHaveBeenCalledWith(techFormDto);
    });

    it('should handle update errors', async () => {
      const techFormDto = {
        nameId: 'nonexistent',
      };
      const error = new Error('Update failed');
      mockTechOctokitUpdateRepo.update.mockRejectedValue(error);

      await expect(controller.update(techFormDto)).rejects.toThrow('Update failed');
    });
  });

  describe('create', () => {
    it('should create tech successfully', async () => {
      const techFormDto = {
        nameId: 'typescript',
        nameBadge: 'TypeScript',
        color: '#3178c6',
        web: 'https://typescriptlang.org',
        preferencia: 60,
        experiencia: 70,
        afinidad: 80,
        img: null,
        desc: intlDesc,
        usoGithub: 4,
        category: TechFormCategory.LENG,
      };

      mockTechOctokitCreateRepo.create.mockResolvedValue(mockTechData);

      const result = await controller.create(techFormDto);

      expect(result).toEqual(mockTechData);
      expect(mockTechOctokitCreateRepo.create).toHaveBeenCalledWith(techFormDto);
    });

    it('should handle create errors', async () => {
      const techFormDto = {
        nameId: 'invalid',
        nameBadge: 'Invalid Tech',
        color: '#000000',
        web: 'https://invalid.dev',
        preferencia: 10,
        experiencia: 10,
        afinidad: 10,
        img: null,
        desc: intlDesc,
        usoGithub: 0,
        category: TechFormCategory.FW,
      };
      const error = new Error('Create failed');
      mockTechOctokitCreateRepo.create.mockRejectedValue(error);

      await expect(controller.create(techFormDto)).rejects.toThrow('Create failed');
    });
  });
});
