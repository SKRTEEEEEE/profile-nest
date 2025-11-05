import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRoleRepo } from '../../../../src/modules/role/infrastructure/role.repo';

describe('MongooseRoleRepo', () => {
  let repo: MongooseRoleRepo;
  let model: jest.Mocked<Model<any>>;

  const mockRole = {
    _id: 'role-123',
    address: '0x123abc',
    permissions: 'ADMIN',
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
        MongooseRoleRepo,
        {
          provide: getModelToken('Role'),
          useValue: mockModel,
        },
      ],
    }).compile();

    repo = module.get<MongooseRoleRepo>(MongooseRoleRepo);
    model = module.get(getModelToken('Role'));
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('create', () => {
    it('should create a role successfully', async () => {
      const roleData = {
        address: '0x123abc',
        permissions: 'ADMIN' as any,
      };

      model.create.mockResolvedValue(mockRole as any);

      const result = await repo.create(roleData);

      expect(result).toEqual(mockRole);
      expect(model.create).toHaveBeenCalledWith(roleData);
    });
  });

  describe('readById', () => {
    it('should find role by id', async () => {
      const roleId = 'role-123';
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRole),
      } as any);

      const result = await repo.readById(roleId);

      expect(result).toEqual(mockRole);
      expect(model.findById).toHaveBeenCalledWith(roleId);
    });

    it('should return null if role not found', async () => {
      const roleId = 'non-existent';
      model.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await repo.readById(roleId);

      expect(result).toBeNull();
      expect(model.findById).toHaveBeenCalledWith(roleId);
    });
  });

  describe('readOne', () => {
    it('should find one role by filter', async () => {
      const filter = { address: '0x123abc' };
      model.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRole),
      } as any);

      const result = await repo.readOne(filter);

      expect(result).toEqual(mockRole);
      expect(model.findOne).toHaveBeenCalledWith(filter);
    });
  });

  describe('updateById', () => {
    it('should update role by id', async () => {
      const updateProps = {
        id: 'role-123',
        updateData: { permissions: 'USER' as any },
      };
      const updatedRole = { ...mockRole, permissions: 'USER' };
      
      model.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedRole),
      } as any);

      const result = await repo.updateById(updateProps);

      expect(result).toEqual(updatedRole);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        updateProps.id,
        updateProps.updateData,
        { new: true }
      );
    });
  });

  describe('delete', () => {
    it('should delete role by filter', async () => {
      const deleteProps = {
        filter: { address: '0x123abc' },
      };

      model.findOneAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRole),
      } as any);

      const result = await repo.delete(deleteProps);

      expect(result).toEqual([mockRole]);
      expect(model.findOneAndDelete).toHaveBeenCalledWith(deleteProps.filter);
    });
  });

  describe('read', () => {
    it('should find all roles', async () => {
      const roles = [mockRole, { ...mockRole, _id: 'role-456' }];
      model.find.mockResolvedValue(roles as any);

      const result = await repo.read();

      expect(result).toEqual(roles);
      expect(model.find).toHaveBeenCalledWith({});
    });
  });

  describe('isAdmin', () => {
    it('should return true if user is admin', async () => {
      const address = '0x123abc';
      model.findOne.mockResolvedValue(mockRole as any);

      const result = await repo.isAdmin(address);

      expect(result).toBe(true);
      expect(model.findOne).toHaveBeenCalledWith({ address, name: 'admin' });
    });

    it('should return false if user is not admin', async () => {
      const address = '0x123abc';
      model.findOne.mockResolvedValue(null as any);

      const result = await repo.isAdmin(address);

      expect(result).toBe(false);
      expect(model.findOne).toHaveBeenCalledWith({ address, name: 'admin' });
    });
  });

  describe('deleteById', () => {
    it('should delete role by id', async () => {
      const roleId = 'role-123';
      
      model.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockRole),
      } as any);

      const result = await repo.deleteById(roleId);

      expect(result).toEqual(mockRole);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(roleId);
    });
  });
});
