import {
  TechCreateUseCase,
  TechReadByIdUseCase,
  TechReadOneUseCase,
  TechUpdateUseCase,
  TechUpdateByIdUseCase,
  TechDeleteUseCase,
} from '../../../../src/modules/tech/application/tech.usecase';
import { TechInterface } from '../../../../src/modules/tech/application/tech.interface';
import { TechBase, LengBase, TechForm } from '../../../../src/domain/entities/tech';
import { DBBase } from '../../../../src/dynamic.types';

describe('Tech Use Cases', () => {
  let mockTechRepository: jest.Mocked<TechInterface>;

  const mockTechBase: TechBase = {
    nameId: 'javascript',
    nameBadge: 'JavaScript',
    color: '#F7DF1E',
    web: 'https://javascript.com',
    preferencia: 5,
    experiencia: 4,
    afinidad: 5,
    img: 'javascript.png',
    desc: { es: 'Lenguaje de programación', en: 'Programming language', ca: 'Llenguatge de programació', de: 'Programmiersprache' },
    usoGithub: 10,
  };

  const mockLengBase: LengBase & DBBase = {
    ...mockTechBase,
    id: 'tech-123',
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
      read: jest.fn(),
    } as jest.Mocked<TechInterface>;
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
      const techData: TechBase = {
        nameId: 'typescript',
        nameBadge: 'TypeScript',
        color: '#3178C6',
        web: 'https://typescriptlang.org',
        preferencia: 5,
        experiencia: 4,
        afinidad: 5,
        img: 'typescript.png',
        desc: { es: 'Superset de JavaScript', en: 'JavaScript superset', ca: 'Superset de JavaScript', de: 'JavaScript-Obermenge' },
        usoGithub: 8,
      };

      mockTechRepository.create.mockResolvedValue(mockLengBase);

      const result = await useCase.create(techData);

      expect(result).toEqual(mockLengBase);
      expect(mockTechRepository.create).toHaveBeenCalledWith(techData);
    });

    it('should handle repository errors', async () => {
      const techData: TechBase = {
        nameId: 'react',
        nameBadge: 'React',
        color: '#61DAFB',
        web: 'https://react.dev',
        preferencia: 5,
        experiencia: 3,
        afinidad: 4,
        img: 'react.png',
        desc: { es: 'Biblioteca JavaScript', en: 'JavaScript library', ca: 'Biblioteca JavaScript', de: 'JavaScript-Bibliothek' },
        usoGithub: 9,
      };

      const error = new Error('Create failed');
      mockTechRepository.create.mockRejectedValue(error);

      await expect(useCase.create(techData)).rejects.toThrow('Create failed');
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

    it('should read a tech by id successfully', async () => {
      mockTechRepository.readById.mockResolvedValue(mockLengBase);

      const result = await useCase.readById('tech-123');

      expect(result).toEqual(mockLengBase);
      expect(mockTechRepository.readById).toHaveBeenCalledWith('tech-123');
    });

    it('should handle repository errors', async () => {
      const error = new Error('Tech not found');
      mockTechRepository.readById.mockRejectedValue(error);

      await expect(useCase.readById('nonexistent')).rejects.toThrow('Tech not found');
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

    it('should read one tech with filter', async () => {
      const filter = { nameId: 'javascript' };
      mockTechRepository.readOne.mockResolvedValue(mockLengBase);

      const result = await useCase.readOne(filter);

      expect(result).toEqual(mockLengBase);
      expect(mockTechRepository.readOne).toHaveBeenCalledWith(filter);
    });

    it('should handle empty results', async () => {
      const filter = { nameId: 'nonexistent' };
      mockTechRepository.readOne.mockResolvedValue(undefined as any);

      const result = await useCase.readOne(filter);

      expect(result).toBeUndefined();
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

    it('should update by form successfully', async () => {
      const formData: Partial<TechForm> = {
        nameId: 'javascript',
        nameBadge: 'JavaScript ES2023',
      };

      mockTechRepository.updateByForm.mockResolvedValue(mockLengBase);

      const result = await useCase.updateByForm(formData);

      expect(result).toEqual(mockLengBase);
      expect(mockTechRepository.updateByForm).toHaveBeenCalledWith(formData);
    });

    it('should update by nameId successfully', async () => {
      const updateData: Partial<LengBase> = {
        nameBadge: 'JavaScript Updated',
        preferencia: 5,
      };

      mockTechRepository.updateByNameId.mockResolvedValue(mockLengBase);

      const result = await useCase.updateByNameId('javascript', updateData);

      expect(result).toEqual(mockLengBase);
      expect(mockTechRepository.updateByNameId).toHaveBeenCalledWith('javascript', updateData);
    });

    it('should handle update by nameId returning null', async () => {
      mockTechRepository.updateByNameId.mockResolvedValue(null);

      const result = await useCase.updateByNameId('nonexistent', {});

      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Update failed');
      mockTechRepository.updateByForm.mockRejectedValue(error);

      await expect(useCase.updateByForm({})).rejects.toThrow('Update failed');
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

    it('should update tech by id successfully', async () => {
      const updateProps = {
        id: 'tech-123',
        updateData: { nameBadge: 'JavaScript Updated' },
      };

      mockTechRepository.updateById.mockResolvedValue(mockLengBase);

      const result = await useCase.updateById(updateProps);

      expect(result).toEqual(mockLengBase);
      expect(mockTechRepository.updateById).toHaveBeenCalledWith(updateProps);
    });

    it('should handle repository errors', async () => {
      const updateProps = {
        id: 'nonexistent',
        updateData: { nameBadge: 'Updated' },
      };
      const error = new Error('Update failed');
      mockTechRepository.updateById.mockRejectedValue(error);

      await expect(useCase.updateById(updateProps)).rejects.toThrow('Update failed');
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

    it('should delete tech successfully', async () => {
      const deleteProps = {
        filter: { nameId: 'obsolete-tech' },
      };

      mockTechRepository.delete.mockResolvedValue(mockLengBase);

      const result = await useCase.delete(deleteProps);

      expect(result).toEqual(mockLengBase);
      expect(mockTechRepository.delete).toHaveBeenCalledWith(deleteProps);
    });

    it('should handle repository errors', async () => {
      const deleteProps = {
        filter: { nameId: 'nonexistent' },
      };
      const error = new Error('Delete failed');
      mockTechRepository.delete.mockRejectedValue(error);

      await expect(useCase.delete(deleteProps)).rejects.toThrow('Delete failed');
    });
  });
});
