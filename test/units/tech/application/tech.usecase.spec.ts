import {
  TechCreateUseCase,
  TechReadByIdUseCase,
  TechReadOneUseCase,
  TechUpdateUseCase,
  TechUpdateByIdUseCase,
  TechDeleteUseCase,
} from '../../../../src/modules/tech/application/tech.usecase';
import { TechInterface, Leng, LengBase } from '../../../../src/modules/tech/application/tech.interface';
import { DBBase } from '../../../../src/dynamic.types';

describe('Tech UseCases', () => {
  let mockTechRepository: jest.Mocked<TechInterface>;
  const mockTech: Leng = {
    nameId: 'typescript',
    nameBadge: 'TypeScript',
    img: 'typescript.png',
    color: '#3178c6',
    web: 'https://typescriptlang.org',
    preferencia: 90,
    afinidad: 85,
    experiencia: 80,
    desc: { es: 'TypeScript', en: 'TypeScript', ca: 'TypeScript', de: 'TypeScript' },
    usoGithub: 5.0,
    id: 'tech-id-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    mockTechRepository = {
      create: jest.fn(),
      readById: jest.fn(),
      readOne: jest.fn(),
      updateByForm: jest.fn(),
      updateByNameId: jest.fn(),
      updateById: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('TechCreateUseCase', () => {
    let useCase: TechCreateUseCase;

    beforeEach(() => {
      useCase = new TechCreateUseCase(mockTechRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should create a tech successfully', async () => {
      const createData: Omit<LengBase, 'id'> = {
        nameId: 'typescript',
        nameBadge: 'TypeScript',
        img: 'typescript.png',
        color: '#3178c6',
        web: 'https://typescriptlang.org',
        preferencia: 90,
        afinidad: 85,
        experiencia: 80,
        desc: { es: 'TypeScript', en: 'TypeScript', ca: 'TypeScript', de: 'TypeScript' },
        usoGithub: 5.0,
      };
      mockTechRepository.create.mockResolvedValue(mockTech);

      const result = await useCase.create(createData);

      expect(result).toEqual(mockTech);
      expect(mockTechRepository.create).toHaveBeenCalledWith(createData);
    });
  });

  describe('TechReadByIdUseCase', () => {
    let useCase: TechReadByIdUseCase;

    beforeEach(() => {
      useCase = new TechReadByIdUseCase(mockTechRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should read tech by id', async () => {
      const techId = 'tech-id-123';
      mockTechRepository.readById.mockResolvedValue(mockTech);

      const result = await useCase.readById(techId);

      expect(result).toEqual(mockTech);
      expect(mockTechRepository.readById).toHaveBeenCalledWith(techId);
    });
  });

  describe('TechReadOneUseCase', () => {
    let useCase: TechReadOneUseCase;

    beforeEach(() => {
      useCase = new TechReadOneUseCase(mockTechRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should read one tech by filter', async () => {
      const filter = { nameId: 'typescript' };
      mockTechRepository.readOne.mockResolvedValue(mockTech);

      const result = await useCase.readOne(filter);

      expect(result).toEqual(mockTech);
      expect(mockTechRepository.readOne).toHaveBeenCalledWith(filter);
    });
  });

  describe('TechUpdateUseCase', () => {
    let useCase: TechUpdateUseCase;

    beforeEach(() => {
      useCase = new TechUpdateUseCase(mockTechRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should update tech by form', async () => {
      const formData = {
        nameId: 'typescript',
        name: 'TypeScript Updated',
      };
      const updatedTech = { ...mockTech, name: 'TypeScript Updated' };
      mockTechRepository.updateByForm.mockResolvedValue(updatedTech);

      const result = await useCase.updateByForm(formData);

      expect(result).toEqual(updatedTech);
      expect(mockTechRepository.updateByForm).toHaveBeenCalledWith(formData);
    });

    it('should update tech by nameId', async () => {
      const nameId = 'typescript';
      const updateData: Partial<LengBase> = { nameBadge: 'TypeScript New Name' };
      const updatedTech = { ...mockTech, nameBadge: 'TypeScript New Name' };
      mockTechRepository.updateByNameId.mockResolvedValue(updatedTech);

      const result = await useCase.updateByNameId(nameId, updateData);

      expect(result).toEqual(updatedTech);
      expect(mockTechRepository.updateByNameId).toHaveBeenCalledWith(
        nameId,
        updateData,
      );
    });
  });

  describe('TechUpdateByIdUseCase', () => {
    let useCase: TechUpdateByIdUseCase;

    beforeEach(() => {
      useCase = new TechUpdateByIdUseCase(mockTechRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should update tech by id', async () => {
      const updateProps = {
        id: 'tech-id-123',
        updateData: { nameBadge: 'TypeScript Updated' } as Partial<Leng>,
      };
      const updatedTech = { ...mockTech, nameBadge: 'TypeScript Updated' };
      mockTechRepository.updateById.mockResolvedValue(updatedTech);

      const result = await useCase.updateById(updateProps);

      expect(result).toEqual(updatedTech);
      expect(mockTechRepository.updateById).toHaveBeenCalledWith(updateProps);
    });
  });

  describe('TechDeleteUseCase', () => {
    let useCase: TechDeleteUseCase;

    beforeEach(() => {
      useCase = new TechDeleteUseCase(mockTechRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should delete tech', async () => {
      const deleteProps = {
        filter: { nameId: 'typescript' },
      };
      mockTechRepository.delete.mockResolvedValue(mockTech);

      const result = await useCase.delete(deleteProps);

      expect(result).toEqual(mockTech);
      expect(mockTechRepository.delete).toHaveBeenCalledWith(deleteProps);
    });
  });
});
