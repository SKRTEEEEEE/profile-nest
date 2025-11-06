import {
  RoleCreateUseCase,
  RoleReadByIdUseCase,
  RoleReadUseCase,
  RoleUpdateByIdUseCase,
  RoleDeleteByIdUseCase,
  RoleDeleteUseCase,
} from '../../../../src/modules/role/application/role.usecase';
import { RoleInterface } from '../../../../src/modules/role/application/role.interface';
import { RoleBase } from '../../../../src/domain/entities/role';
import { DBBase } from '../../../../src/dynamic.types';
import { RoleType } from '../../../../src/domain/entities/role.type';

describe('Role Use Cases', () => {
  let mockRoleRepository: jest.Mocked<RoleInterface>;

  const mockRole: RoleBase & DBBase = {
    id: 'role-123',
    address: '0x123...abc',
    permissions: RoleType.ADMIN,
    stripeCustomerId: 'cus_123',
    subscriptionId: 'sub_123',
    subscriptionStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as RoleBase & DBBase;

  beforeEach(() => {
    mockRoleRepository = {
      create: jest.fn(),
      readById: jest.fn(),
      read: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
      delete: jest.fn(),
      isAdmin: jest.fn(),
    } as jest.Mocked<RoleInterface>;
  });

  describe('RoleCreateUseCase', () => {
    let useCase: RoleCreateUseCase;

    beforeEach(() => {
      useCase = new RoleCreateUseCase(mockRoleRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should create a role successfully', async () => {
      const roleData: Omit<RoleBase, 'id'> = {
        address: '0x123...abc',
        permissions: RoleType.ADMIN,
      };

      mockRoleRepository.create.mockResolvedValue(mockRole);

      const result = await useCase.create(roleData);

      expect(result).toEqual(mockRole);
      expect(mockRoleRepository.create).toHaveBeenCalledWith(roleData);
    });

    it('should handle repository errors', async () => {
      const roleData: Omit<RoleBase, 'id'> = {
        address: '0x123...abc',
        permissions: RoleType.ADMIN,
      };

      const error = new Error('Create failed');
      mockRoleRepository.create.mockRejectedValue(error);

      await expect(useCase.create(roleData)).rejects.toThrow('Create failed');
    });
  });

  describe('RoleReadByIdUseCase', () => {
    let useCase: RoleReadByIdUseCase;

    beforeEach(() => {
      useCase = new RoleReadByIdUseCase(mockRoleRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should read a role by id successfully', async () => {
      mockRoleRepository.readById.mockResolvedValue(mockRole);

      const result = await useCase.readById('role-123');

      expect(result).toEqual(mockRole);
      expect(mockRoleRepository.readById).toHaveBeenCalledWith('role-123');
    });

    it('should handle repository errors', async () => {
      const error = new Error('Role not found');
      mockRoleRepository.readById.mockRejectedValue(error);

      await expect(useCase.readById('nonexistent')).rejects.toThrow('Role not found');
    });
  });

  describe('RoleReadUseCase', () => {
    let useCase: RoleReadUseCase;

    beforeEach(() => {
      useCase = new RoleReadUseCase(mockRoleRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should read roles with filter', async () => {
      const filter = { permissions: RoleType.ADMIN };
      mockRoleRepository.read.mockResolvedValue([mockRole]);

      const result = await useCase.read(filter);

      expect(result).toEqual([mockRole]);
      expect(mockRoleRepository.read).toHaveBeenCalledWith(filter);
    });

    it('should read roles without filter', async () => {
      mockRoleRepository.read.mockResolvedValue([mockRole]);

      const result = await useCase.read();

      expect(result).toEqual([mockRole]);
      expect(mockRoleRepository.read).toHaveBeenCalledWith(undefined);
    });

    it('should check if address is admin', async () => {
      mockRoleRepository.isAdmin.mockResolvedValue(true);

      const result = await useCase.isAdmin('0x123...abc');

      expect(result).toBe(true);
      expect(mockRoleRepository.isAdmin).toHaveBeenCalledWith('0x123...abc');
    });

    it('should return false for non-admin address', async () => {
      mockRoleRepository.isAdmin.mockResolvedValue(false);

      const result = await useCase.isAdmin('0x456...def');

      expect(result).toBe(false);
      expect(mockRoleRepository.isAdmin).toHaveBeenCalledWith('0x456...def');
    });
  });

  describe('RoleUpdateByIdUseCase', () => {
    let useCase: RoleUpdateByIdUseCase;

    beforeEach(() => {
      useCase = new RoleUpdateByIdUseCase(mockRoleRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should update a role by id successfully', async () => {
      const updateProps = {
        id: 'role-123',
        updateData: { permissions: RoleType.STUDENT },
      };
      const updatedRole = { ...mockRole, permissions: RoleType.STUDENT };

      mockRoleRepository.updateById.mockResolvedValue(updatedRole);

      const result = await useCase.updateById(updateProps);

      expect(result).toEqual(updatedRole);
      expect(mockRoleRepository.updateById).toHaveBeenCalledWith(updateProps);
    });

    it('should handle repository errors', async () => {
      const updateProps = {
        id: 'nonexistent',
        updateData: { permissions: RoleType.STUDENT },
      };
      const error = new Error('Update failed');
      mockRoleRepository.updateById.mockRejectedValue(error);

      await expect(useCase.updateById(updateProps)).rejects.toThrow('Update failed');
    });
  });

  describe('RoleDeleteByIdUseCase', () => {
    let useCase: RoleDeleteByIdUseCase;

    beforeEach(() => {
      useCase = new RoleDeleteByIdUseCase(mockRoleRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should delete a role by id successfully', async () => {
      mockRoleRepository.deleteById.mockResolvedValue(mockRole);

      const result = await useCase.deleteById('role-123');

      expect(result).toEqual(mockRole);
      expect(mockRoleRepository.deleteById).toHaveBeenCalledWith('role-123');
    });

    it('should handle repository errors', async () => {
      const error = new Error('Delete failed');
      mockRoleRepository.deleteById.mockRejectedValue(error);

      await expect(useCase.deleteById('nonexistent')).rejects.toThrow('Delete failed');
    });
  });

  describe('RoleDeleteUseCase', () => {
    let useCase: RoleDeleteUseCase;

    beforeEach(() => {
      useCase = new RoleDeleteUseCase(mockRoleRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should delete roles with filter successfully', async () => {
      const deleteProps = {
        filter: { address: '0x123...abc' },
      };

      mockRoleRepository.delete.mockResolvedValue([mockRole]);

      const result = await useCase.delete(deleteProps);

      expect(result).toEqual([mockRole]);
      expect(mockRoleRepository.delete).toHaveBeenCalledWith(deleteProps);
    });

    it('should handle repository errors', async () => {
      const deleteProps = {
        filter: { address: '0x999' },
      };
      const error = new Error('Bulk delete failed');
      mockRoleRepository.delete.mockRejectedValue(error);

      await expect(useCase.delete(deleteProps)).rejects.toThrow('Bulk delete failed');
    });
  });
});
