import { Test, TestingModule } from '@nestjs/testing';
import { RoleAuthUseCase } from '../../../src/shareds/role-auth/application/role-auth.usecase';
import { MongooseRoleRepo } from '../../../src/modules/role/infrastructure/role.repo';

describe('RoleAuthUseCase', () => {
  let useCase: RoleAuthUseCase;
  let roleRepo: jest.Mocked<MongooseRoleRepo>;

  const mockRole = {
    id: 'role-123',
    address: '0x123abc',
    permissions: 'ADMIN',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const mockRoleRepo = {
      readOne: jest.fn(),
      isAdmin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleAuthUseCase,
        {
          provide: MongooseRoleRepo,
          useValue: mockRoleRepo,
        },
      ],
    }).compile();

    useCase = module.get<RoleAuthUseCase>(RoleAuthUseCase);
    roleRepo = module.get(MongooseRoleRepo);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('validateRole', () => {
    it('should return role if user has valid role', async () => {
      const address = '0x123abc';
      const requiredRole = 'ADMIN';

      roleRepo.readOne.mockResolvedValue(mockRole as any);

      const result = await useCase.validateRole(address, requiredRole);

      expect(result).toEqual(mockRole);
      expect(roleRepo.readOne).toHaveBeenCalledWith({ 
        address, 
        permissions: requiredRole 
      });
    });

    it('should return null if user does not have required role', async () => {
      const address = '0x123abc';
      const requiredRole = 'ADMIN';

      roleRepo.readOne.mockResolvedValue(null);

      const result = await useCase.validateRole(address, requiredRole);

      expect(result).toBeNull();
      expect(roleRepo.readOne).toHaveBeenCalledWith({ 
        address, 
        permissions: requiredRole 
      });
    });
  });

  describe('isAdmin', () => {
    it('should return true if user is admin', async () => {
      const address = '0x123abc';
      roleRepo.isAdmin.mockResolvedValue(true);

      const result = await useCase.isAdmin(address);

      expect(result).toBe(true);
      expect(roleRepo.isAdmin).toHaveBeenCalledWith(address);
    });

    it('should return false if user is not admin', async () => {
      const address = '0x123abc';
      roleRepo.isAdmin.mockResolvedValue(false);

      const result = await useCase.isAdmin(address);

      expect(result).toBe(false);
      expect(roleRepo.isAdmin).toHaveBeenCalledWith(address);
    });
  });
});
