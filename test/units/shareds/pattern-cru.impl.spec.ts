import { MongooseCRUImpl } from 'src/shareds/pattern/infrastructure/implementations/cru.impl';
import { Model } from 'mongoose';

class TestEntity {
  id?: string;
  name: string;
  value: number;
}

describe('MongooseCRUImpl', () => {
  let impl: MongooseCRUImpl<TestEntity>;
  let mockModel: any;

  beforeEach(() => {
    mockModel = {
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
    };

    // Mock constructor
    mockModel.prototype = {
      save: jest.fn(),
    };

    impl = new MongooseCRUImpl(mockModel);
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const mockData = { name: 'Test', value: 123 };
      const mockSavedDoc = {
        _id: 'abc123',
        ...mockData,
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: jest.fn().mockReturnThis(),
      };

      const mockInstance = {
        save: jest.fn().mockResolvedValue(mockSavedDoc),
      };

      // Mock constructor to return our instance
      const OriginalModel = mockModel;
      mockModel = jest.fn().mockImplementation(() => mockInstance);
      Object.assign(mockModel, OriginalModel);

      impl = new MongooseCRUImpl(mockModel);

      const result = await impl.create(mockData);

      expect(mockModel).toHaveBeenCalledWith(mockData);
      expect(mockInstance.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error when save fails', async () => {
      const mockData = { name: 'Test', value: 123 };

      const mockInstance = {
        save: jest.fn().mockResolvedValue(null),
      };

      const OriginalModel = mockModel;
      mockModel = jest.fn().mockImplementation(() => mockInstance);
      Object.assign(mockModel, OriginalModel);

      impl = new MongooseCRUImpl(mockModel);

      await expect(impl.create(mockData)).rejects.toThrow();
    });

    it('should throw error when save operation throws', async () => {
      const mockData = { name: 'Test', value: 123 };

      const mockInstance = {
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      const OriginalModel = mockModel;
      mockModel = jest.fn().mockImplementation(() => mockInstance);
      Object.assign(mockModel, OriginalModel);

      impl = new MongooseCRUImpl(mockModel);

      await expect(impl.create(mockData)).rejects.toThrow();
    });
  });

  describe('readById', () => {
    it('should read a document by id', async () => {
      const mockDoc = {
        _id: 'abc123',
        name: 'Test',
        value: 123,
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: jest.fn().mockReturnThis(),
      };

      mockModel.findById = jest.fn().mockResolvedValue(mockDoc);
      impl = new MongooseCRUImpl(mockModel);

      const result = await impl.readById('abc123');

      expect(mockModel.findById).toHaveBeenCalledWith('abc123');
      expect(result).toBeDefined();
    });

    it('should throw error when document not found', async () => {
      mockModel.findById = jest.fn().mockResolvedValue(null);
      impl = new MongooseCRUImpl(mockModel);

      await expect(impl.readById('nonexistent')).rejects.toThrow();
    });

    it('should throw error when findById throws', async () => {
      mockModel.findById = jest.fn().mockRejectedValue(new Error('Database error'));
      impl = new MongooseCRUImpl(mockModel);

      await expect(impl.readById('abc123')).rejects.toThrow();
    });
  });

  describe('updateById', () => {
    it('should update a document by id', async () => {
      const mockUpdatedDoc = {
        _id: 'abc123',
        name: 'Updated Test',
        value: 456,
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: jest.fn().mockReturnThis(),
      };

      mockModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedDoc);
      impl = new MongooseCRUImpl(mockModel);

      const result = await impl.updateById({
        id: 'abc123',
        updateData: { name: 'Updated Test', value: 456 },
      });

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc123',
        { name: 'Updated Test', value: 456 },
        { new: true },
      );
      expect(result).toBeDefined();
    });

    it('should use custom options when provided', async () => {
      const mockUpdatedDoc = {
        _id: 'abc123',
        name: 'Updated',
        value: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: jest.fn().mockReturnThis(),
      };

      mockModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedDoc);
      impl = new MongooseCRUImpl(mockModel);

      const customOptions = { new: false, upsert: true };

      await impl.updateById({
        id: 'abc123',
        updateData: { value: 999 },
        options: customOptions,
      });

      expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc123',
        { value: 999 },
        customOptions,
      );
    });

    it('should throw error when document not found', async () => {
      mockModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      impl = new MongooseCRUImpl(mockModel);

      await expect(
        impl.updateById({
          id: 'nonexistent',
          updateData: { name: 'Test' },
        }),
      ).rejects.toThrow();
    });

    it('should throw error when update fails', async () => {
      mockModel.findByIdAndUpdate = jest.fn().mockRejectedValue(
        new Error('Update failed'),
      );
      impl = new MongooseCRUImpl(mockModel);

      await expect(
        impl.updateById({
          id: 'abc123',
          updateData: { name: 'Test' },
        }),
      ).rejects.toThrow();
    });
  });
});
