import {
  TechCreateUseCase,
  TechReadByIdUseCase,
  TechReadOneUseCase,
  TechUpdateUseCase,
  TechUpdateByIdUseCase,
  TechDeleteUseCase,
} from '../../../../src/modules/tech/application/tech.usecase';
import { TechRepository } from '../../../../src/modules/tech/application/tech.interface';
import { TechBase, LengBase, TechForm } from '../../../../src/domain/entities/tech';
import { DBBase } from '../../../../src/dynamic.types';

describe('Tech Use Cases', () => {
  let mockTechRepository: jest.Mocked<TechRepository>;

  const mockTechBase: TechBase = {
    id: 'tech-123',
    nameId: 'javascript',
    name: 'JavaScript',
    category: 'programming',
  };

  const mockLengBase: LengBase & DBBase = {
    ...mockTechBase,
    _id: 'tech-123',
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
    } as jest.Mocked<TechRepository>;
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
      const techData: Omit<TechBase, 'id'> = {
        nameId: 'typescript',
        name: 'TypeScript',
        category: 'programming',
      };

      mockTechRepository.create.mockResolvedValue(mockLengBase);

      const result = await useCase.create(techData);

      expect(result).toEqual(mockLengBase);
      expect(mockTechRepository.create).toHaveBeenCalledWith(techData);
    });

    it('should handle repository errors', async () => {
      const techData: Omit<TechBase, 'id'> = {
        nameId: 'react',
        name: 'React',
        category: 'framework',
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
      mockTechRepository.readOne.mockResolvedValue(undefined);

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
        name: 'JavaScript ES2023',
      };

      mockTechRepository.updateByForm.mockResolvedValue(mockLengBase);

      const result = await useCase.updateByForm(formData);

      expect(result).toEqual(mockLengBase);
      expect(mockTechRepository.updateByForm).toHaveBeenCalledWith(formData);
    });

    it('should update by nameId successfully', async () => {
      const updateData: Partial<LengBase> = {
        name: 'JavaScript Updated',
        category: 'language',
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
        data: { name: 'JavaScript Updated' },
      };

      mockTechRepository.updateById.mockResolvedValue(mockLengBase);

      const result = await useCase.updateById(updateProps);

      expect(result).toEqual(mockLengBase);
      expect(mockTechRepository.updateById).toHaveBeenCalledWith(updateProps);
    });

    it('should handle repository errors', async () => {
      const updateProps = {
        id: 'nonexistent',
        data: { name: 'Updated' },
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
