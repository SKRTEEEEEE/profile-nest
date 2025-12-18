import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRoleRepo } from 'src/modules/role/infrastructure/role.repo';
import { RoleBase } from '@skrteeeeee/profile-domain';
import { RoleType } from '@skrteeeeee/profile-domain';

describe('MongooseRoleRepo', () => {
  let repo: MongooseRoleRepo;
  let model: jest.Mocked<Model<RoleBase>>;

  beforeEach(async () => {
    const mockModel = {
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      findOne: jest.fn(),
      findOneAndDelete: jest.fn(),
    } as Partial<jest.Mocked<Model<RoleBase>>>;

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
    model = module.get(getModelToken('Role')) as jest.Mocked<Model<RoleBase>>;

    jest.spyOn<any, any>(repo as any, 'documentToPrimary').mockReturnValue({
      id: 'role-123',
      address: '0x123abc',
      permissions: RoleType.ADMIN,
    });
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('read', () => {
    it('should return roles without filter', async () => {
      const docs = [{}, {}] as any;
      (model.find as jest.Mock).mockResolvedValue(docs);

      const result = await repo.read();

      expect(model.find).toHaveBeenCalledWith({});
      expect(result).toHaveLength(2);
    });

    it('should forward filter as wrapped object', async () => {
      const docs = [{}] as any;
      (model.find as jest.Mock).mockResolvedValue(docs);

      const filter = { permissions: RoleType.ADMIN };
      await repo.read(filter);

      expect(model.find).toHaveBeenCalledWith({ filter });
    });
  });

  describe('readById', () => {
    it('should map found document', async () => {
      (model.findById as jest.Mock).mockResolvedValue({} as any);

      const result = await repo.readById('role-123');

      expect(model.findById).toHaveBeenCalledWith('role-123');
      expect(result).toEqual({
        id: 'role-123',
        address: '0x123abc',
        permissions: RoleType.ADMIN,
      });
    });
  });

  describe('updateById', () => {
    it('should update document via model', async () => {
      (model.findByIdAndUpdate as jest.Mock).mockResolvedValue({} as any);

      const props = {
        id: 'role-123',
        updateData: { permissions: RoleType.STUDENT },
      };

      const result = await repo.updateById(props);

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        props.id,
        props.updateData,
        { new: true },
      );
      expect(result).toEqual({
        id: 'role-123',
        address: '0x123abc',
        permissions: RoleType.ADMIN,
      });
    });
  });

  describe('delete', () => {
    it('should delete by filter and wrap result', async () => {
      (model.findOneAndDelete as jest.Mock).mockResolvedValue({} as any);

      const result = await repo.delete({ filter: { address: '0x123abc' } });

      expect(model.findOneAndDelete).toHaveBeenCalledWith({ address: '0x123abc' });
      expect(result[0]).toEqual({
        id: 'role-123',
        address: '0x123abc',
        permissions: RoleType.ADMIN,
      });
    });
  });

  describe('deleteById', () => {
    it('should delete by id and return primary doc', async () => {
      (model.findByIdAndDelete as jest.Mock).mockResolvedValue({} as any);

      const result = await repo.deleteById('role-123');

      expect(model.findByIdAndDelete).toHaveBeenCalledWith('role-123');
      expect(result).toEqual({
        id: 'role-123',
        address: '0x123abc',
        permissions: RoleType.ADMIN,
      });
    });
  });

  describe('isAdmin', () => {
    it('should return true when role exists', async () => {
      (model.findOne as jest.Mock).mockResolvedValue({});

      const result = await repo.isAdmin('0x123abc');

      expect(model.findOne).toHaveBeenCalledWith({ address: '0x123abc', name: 'admin' });
      expect(result).toBe(true);
    });

    it('should return false when role missing', async () => {
      (model.findOne as jest.Mock).mockResolvedValue(null);

      const result = await repo.isAdmin('0x123abc');

      expect(result).toBe(false);
    });
  });
});
