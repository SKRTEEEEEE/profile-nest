import { MongoosePopulateImpl } from 'src/shareds/pattern/infrastructure/implementations/populate.impl';
import { Model } from 'mongoose';

class TestEntity {
  id?: string;
  name: string;
  value: number;
}

describe('MongoosePopulateImpl', () => {
  let impl: MongoosePopulateImpl<TestEntity>;
  let mockModel: any;

  beforeEach(() => {
    mockModel = {
      insertMany: jest.fn(),
    };

    impl = new MongoosePopulateImpl(mockModel);
  });

  describe('populate', () => {
    it('should populate documents successfully', async () => {
      const mockDocs = [
        { name: 'Doc1', value: 100 },
        { name: 'Doc2', value: 200 },
      ];

      const mockInsertedDocs = [
        {
          _id: 'id1',
          name: 'Doc1',
          value: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
          toObject: jest.fn().mockReturnThis(),
        },
        {
          _id: 'id2',
          name: 'Doc2',
          value: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
          toObject: jest.fn().mockReturnThis(),
        },
      ];

      mockModel.insertMany = jest.fn().mockResolvedValue(mockInsertedDocs);
      impl = new MongoosePopulateImpl(mockModel);

      const result = await impl.populate(mockDocs);

      expect(mockModel.insertMany).toHaveBeenCalledWith(mockDocs);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });

    it('should throw error when docs array is empty', async () => {
      await expect(impl.populate([])).rejects.toThrow();
    });

    it('should throw error when insertMany fails', async () => {
      const mockDocs = [{ name: 'Doc1', value: 100 }];

      mockModel.insertMany = jest.fn().mockRejectedValue(
        new Error('Insert failed'),
      );
      impl = new MongoosePopulateImpl(mockModel);

      await expect(impl.populate(mockDocs)).rejects.toThrow();
    });

    it('should handle single document insertion', async () => {
      const mockDocs = [{ name: 'SingleDoc', value: 500 }];

      const mockInsertedDocs = [
        {
          _id: 'single-id',
          name: 'SingleDoc',
          value: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
          toObject: jest.fn().mockReturnThis(),
        },
      ];

      mockModel.insertMany = jest.fn().mockResolvedValue(mockInsertedDocs);
      impl = new MongoosePopulateImpl(mockModel);

      const result = await impl.populate(mockDocs);

      expect(result.length).toBe(1);
    });

    it('should handle large batch of documents', async () => {
      const mockDocs = Array.from({ length: 100 }, (_, i) => ({
        name: `Doc${i}`,
        value: i * 10,
      }));

      const mockInsertedDocs = mockDocs.map((doc, i) => ({
        _id: `id${i}`,
        ...doc,
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: jest.fn().mockReturnThis(),
      }));

      mockModel.insertMany = jest.fn().mockResolvedValue(mockInsertedDocs);
      impl = new MongoosePopulateImpl(mockModel);

      const result = await impl.populate(mockDocs);

      expect(result.length).toBe(100);
      expect(mockModel.insertMany).toHaveBeenCalledWith(mockDocs);
    });

    it('should throw error with empty array even after resArrCheck', async () => {
      const mockDocs = [];

      await expect(impl.populate(mockDocs)).rejects.toThrow();
      expect(mockModel.insertMany).not.toHaveBeenCalled();
    });
  });
});
