import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongooseTechRepo } from 'src/modules/tech/infrastructure/tech.repo';
import { Model } from 'mongoose';
import { LengBase } from 'src/domain/entities/tech';
import { NativeLoggerService } from 'src/shareds/presentation/native-logger.service';

describe('MongooseTechRepo', () => {
  let repo: MongooseTechRepo;
  let mockModel: any;

  beforeEach(async () => {
    mockModel = {
      findOne: jest.fn(),
      find: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findOneAndDelete: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongooseTechRepo,
        {
          provide: getModelToken('Lenguaje'),
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

    repo = module.get<MongooseTechRepo>(MongooseTechRepo);
  });

  describe('readOne', () => {
    it('should find and return one language document', async () => {
      const mockLeng = {
        _id: '123',
        nameId: 'typescript',
        nameBadge: 'TypeScript',
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: jest.fn().mockReturnThis(),
      };

      mockModel.findOne.mockResolvedValue(mockLeng);

      const result = await repo.readOne({ nameId: 'typescript' });

      expect(mockModel.findOne).toHaveBeenCalledWith({ nameId: 'typescript' });
      expect(result).toBeDefined();
    });

    it('should throw error when document is not found', async () => {
      mockModel.findOne.mockResolvedValue(null);

      await expect(repo.readOne({ nameId: 'nonexistent' })).rejects.toThrow();
    });

    it('should throw error when find operation fails', async () => {
      mockModel.findOne.mockRejectedValue(new Error('Database error'));

      await expect(repo.readOne({ nameId: 'typescript' })).rejects.toThrow();
    });
  });

  describe('read', () => {
    it('should return all languages when no filter is provided', async () => {
      const mockLengs = [
        {
          _id: '123',
          nameId: 'typescript',
          nameBadge: 'TypeScript',
          frameworks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          toObject: jest.fn().mockReturnThis(),
        },
      ];

      mockModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLengs),
      });
      mockModel.find.mockResolvedValue(mockLengs);

      const result = await repo.read();

      expect(mockModel.find).toHaveBeenCalledWith({});
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return filtered languages when filter is provided', async () => {
      const mockLengs = [
        {
          _id: '123',
          nameId: 'typescript',
          nameBadge: 'TypeScript',
          frameworks: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          toObject: jest.fn().mockReturnThis(),
        },
      ];

      mockModel.find.mockResolvedValue(mockLengs);

      const result = await repo.read({ nameId: 'typescript' });

      expect(mockModel.find).toHaveBeenCalledWith({ nameId: 'typescript' });
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw error when no documents are found', async () => {
      mockModel.find.mockResolvedValue([]);

      await expect(repo.read()).rejects.toThrow();
    });

    it('should throw error when find operation fails', async () => {
      mockModel.find.mockRejectedValue(new Error('Database error'));

      await expect(repo.read()).rejects.toThrow();
    });
  });

  describe('updateByNameId', () => {
    it('should update a language by nameId', async () => {
      const updateData = { nameBadge: 'TypeScript Updated' };
      const mockUpdatedLeng = {
        _id: '123',
        nameId: 'typescript',
        ...updateData,
      };

      mockModel.findOneAndUpdate.mockResolvedValue(mockUpdatedLeng);

      const result = await repo.updateByNameId('typescript', updateData);

      expect(result).toEqual(mockUpdatedLeng);
    });

    it('should throw error when update fails', async () => {
      mockModel.findOneAndUpdate.mockRejectedValue(new Error('Update failed'));

      await expect(
        repo.updateByNameId('typescript', { nameBadge: 'Updated' }),
      ).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a language document', async () => {
      const mockDeletedLeng = {
        _id: '123',
        nameId: 'typescript',
        nameBadge: 'TypeScript',
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: jest.fn().mockReturnThis(),
      };

      mockModel.findOneAndDelete.mockResolvedValue(mockDeletedLeng);

      const result = await repo.delete({
        filter: { nameId: 'typescript' },
      });

      expect(mockModel.findOneAndDelete).toHaveBeenCalledWith({
        nameId: 'typescript',
      });
      expect(result).toBeDefined();
    });

    it('should throw error when document to delete is not found', async () => {
      mockModel.findOneAndDelete.mockResolvedValue(null);

      await expect(
        repo.delete({ filter: { nameId: 'nonexistent' } }),
      ).rejects.toThrow();
    });

    it('should throw error when delete operation fails', async () => {
      mockModel.findOneAndDelete.mockRejectedValue(
        new Error('Delete failed'),
      );

      await expect(
        repo.delete({ filter: { nameId: 'typescript' } }),
      ).rejects.toThrow();
    });
  });
});
