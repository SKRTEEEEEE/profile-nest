import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseUserRepo } from '../../../../src/modules/user/infrastructure/user.repo';
import { RoleType } from '../../../../src/domain/entities/role.type';

describe('MongooseUserRepo', () => {
  let repo: MongooseUserRepo;
  let model: jest.Mocked<Model<any>>;

  const mockUser = {
    _id: 'user-123',
    address: '0x123abc',
    email: 'test@example.com',
    nick: 'tester',
    img: null,
    role: RoleType.STUDENT,
    roleId: null,
    solicitud: null,
    isVerified: true,
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
      countDocuments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MongooseUserRepo,
        {
          provide: getModelToken('User'),
          useValue: mockModel,
        },
      ],
    }).compile();

    repo = module.get<MongooseUserRepo>(MongooseUserRepo);
    model = module.get(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const userData = {
        address: '0x123abc',
        email: 'test@example.com',
        nick: 'tester',
        img: null,
        role: RoleType.STUDENT,
        roleId: null,
        solicitud: null,
        isVerified: false,
      };

      model.create.mockResolvedValue(mockUser as any);

      const result = await repo.create(userData);

      expect(result).toEqual(mockUser);
      expect(model.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('readById', () => {
    it('should find user by id', async () => {
      const userId = 'user-123';
      model.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await repo.readById(userId);

      expect(result).toEqual(mockUser);
      expect(model.findById).toHaveBeenCalledWith(userId);
    });

    it('should return null if user not found', async () => {
      const userId = 'non-existent';
      model.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await repo.readById(userId);

      expect(result).toBeNull();
      expect(model.findById).toHaveBeenCalledWith(userId);
    });
  });

  describe('readByAddress', () => {
    it('should find user by address', async () => {
      const address = '0x123abc';
      model.findOne.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await repo.readByAddress(address);

      expect(result).toEqual(mockUser);
      expect(model.findOne).toHaveBeenCalledWith({ address });
    });
  });

  describe('readOne', () => {
    it('should find one user by filter', async () => {
      const filter = { email: 'test@example.com' };
      model.findOne.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await repo.readOne(filter);

      expect(result).toEqual(mockUser);
      expect(model.findOne).toHaveBeenCalledWith(filter);
    });
  });

  describe('updateById', () => {
    it('should update user by id', async () => {
      const updateProps = {
        id: 'user-123',
        updateData: { name: 'Updated User' },
      };
      const updatedUser = { ...mockUser, name: 'Updated User' };
      
      model.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(updatedUser),
      } as any);

      const result = await repo.updateById(updateProps);

      expect(result).toEqual(updatedUser);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        updateProps.id,
        updateProps.updateData,
        { new: true }
      );
    });
  });

  describe('read', () => {
    it('should find all users', async () => {
      const users = [mockUser, { ...mockUser, _id: 'user-456' }];
      model.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(users),
      } as any);

      const result = await repo.read({});

      expect(result).toEqual(users);
      expect(model.find).toHaveBeenCalledWith({});
    });

    it('should find users with filter', async () => {
      const filter = { role: RoleType.ADMIN };
      const users = [mockUser];
      model.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(users),
      } as any);

      const result = await repo.read(filter);

      expect(result).toEqual(users);
      expect(model.find).toHaveBeenCalledWith(filter);
    });
  });

  describe('deleteById', () => {
    it('should delete user by id', async () => {
      const userId = 'user-123';
      
      model.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await repo.deleteById(userId);

      expect(result).toEqual(mockUser);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(userId);
    });
  });
});
