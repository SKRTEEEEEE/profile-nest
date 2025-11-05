import {
  UserCreateUseCase,
  UserReadOneUseCase,
  UserReadUseCase,
  UserReadByIdUseCase,
  UserUpdateUseCase,
  UserUpdateByIdUseCase,
  UserDeleteByIdUseCase,
  UserVerifyEmailUseCase,
} from '../../../../src/modules/user/application/user.usecase';
import { UserInterface } from '../../../../src/modules/user/application/user.interface';
import { DBBase } from '../../../../src/dynamic.types';
import { DatabaseFindError, UnauthorizedError, DatabaseActionError } from '../../../../src/domain/flows/domain.error';

describe('User Use Cases', () => {
  let mockUserRepository: jest.Mocked<UserInterface>;

  const mockUser: UserBase & DBBase = {
    nick: 'testuser',
    img: 'http://example.com/avatar.jpg',
    address: '0x123...abc',
    roleId: null,
    role: null,
    solicitud: null,
    email: 'test@example.com',
    isVerified: false,
    verifyToken: 'token123',
    verifyTokenExpire: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    id: 'user-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      readOne: jest.fn(),
      read: jest.fn(),
      readById: jest.fn(),
      readByAddress: jest.fn(),
      update: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    } as jest.Mocked<UserInterface>;
  });

  describe('UserCreateUseCase', () => {
    let useCase: UserCreateUseCase;

    beforeEach(() => {
      useCase = new UserCreateUseCase(mockUserRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should create a user successfully', async () => {
      const createProps: Partial<UserBase> = {
        address: '0x456...def',
        email: 'new@example.com',
        nick: 'newuser',
        img: null,
      };

      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await useCase.create(createProps);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createProps);
    });

    it('should handle create errors', async () => {
      const createProps: Partial<UserBase> = { 
        address: '0x456...def',
        nick: 'erroruser',
        img: null,
      };
      const error = new Error('Create failed');
      mockUserRepository.create.mockRejectedValue(error);

      await expect(useCase.create(createProps)).rejects.toThrow('Create failed');
    });
  });

  describe('UserReadOneUseCase', () => {
    let useCase: UserReadOneUseCase;

    beforeEach(() => {
      useCase = new UserReadOneUseCase(mockUserRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should read one user with filter', async () => {
      const filter = { email: 'test@example.com' };
      mockUserRepository.readOne.mockResolvedValue(mockUser);

      const result = await useCase.readOne(filter);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.readOne).toHaveBeenCalledWith(filter);
    });

    it('should read user by address', async () => {
      mockUserRepository.readOne.mockResolvedValue(mockUser);

      const result = await useCase.readByAddress('0x123...abc');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.readOne).toHaveBeenCalledWith({ address: '0x123...abc' });
    });

    it('should handle readOne returning null', async () => {
      mockUserRepository.readOne.mockResolvedValue(null as any);

      const result = await useCase.readOne({ address: 'nonexistent' });

      expect(result).toBeNull();
    });
  });

  describe('UserReadUseCase', () => {
    let useCase: UserReadUseCase;

    beforeEach(() => {
      useCase = new UserReadUseCase(mockUserRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should read users with filter', async () => {
      const filter = { isVerified: true };
      mockUserRepository.read.mockResolvedValue([mockUser]);

      const result = await useCase.read(filter);

      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.read).toHaveBeenCalledWith(filter);
    });

    it('should read users without filter', async () => {
      mockUserRepository.read.mockResolvedValue([mockUser]);

      const result = await useCase.read();

      expect(result).toEqual([mockUser]);
      expect(mockUserRepository.read).toHaveBeenCalledWith(undefined);
    });
  });

  describe('UserReadByIdUseCase', () => {
    let useCase: UserReadByIdUseCase;

    beforeEach(() => {
      useCase = new UserReadByIdUseCase(mockUserRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should read user by id successfully', async () => {
      mockUserRepository.readById.mockResolvedValue(mockUser);

      const result = await useCase.readById('user-123');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.readById).toHaveBeenCalledWith('user-123');
    });

    it('should handle repository errors', async () => {
      const error = new Error('User not found');
      mockUserRepository.readById.mockRejectedValue(error);

      await expect(useCase.readById('nonexistent')).rejects.toThrow('User not found');
    });
  });

  describe('UserUpdateUseCase', () => {
    let useCase: UserUpdateUseCase;

    beforeEach(() => {
      useCase = new UserUpdateUseCase(mockUserRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should update user successfully', async () => {
      const filter = { address: '0x123...abc' };
      const options = { isVerified: true };
      
      mockUserRepository.update.mockResolvedValue(mockUser);

      const result = await useCase.update(filter, options);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(filter, options);
    });
  });

  describe('UserUpdateByIdUseCase', () => {
    let useCase: UserUpdateByIdUseCase;

    beforeEach(() => {
      useCase = new UserUpdateByIdUseCase(mockUserRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should update user by id successfully', async () => {
      const updateProps = {
        id: 'user-123',
        updateData: { isVerified: true },
      };

      mockUserRepository.updateById.mockResolvedValue({ ...mockUser, isVerified: true });

      const result = await useCase.updateById(updateProps);

      expect(result.isVerified).toBe(true);
      expect(mockUserRepository.updateById).toHaveBeenCalledWith(updateProps);
    });
  });

  describe('UserDeleteByIdUseCase', () => {
    let useCase: UserDeleteByIdUseCase;

    beforeEach(() => {
      useCase = new UserDeleteByIdUseCase(mockUserRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should delete user by id successfully', async () => {
      mockUserRepository.deleteById.mockResolvedValue(mockUser);

      const result = await useCase.deleteById('user-123');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.deleteById).toHaveBeenCalledWith('user-123');
    });
  });

  describe('UserVerifyEmailUseCase', () => {
    let useCase: UserVerifyEmailUseCase;

    beforeEach(() => {
      useCase = new UserVerifyEmailUseCase(mockUserRepository);
    });

    it('should be defined', () => {
      expect(useCase).toBeDefined();
    });

    it('should verify email successfully', async () => {
      const props = { id: 'user-123', verifyToken: 'token123' };
      const verifiedUser = { ...mockUser, isVerified: true, verifyToken: undefined, verifyTokenExpire: undefined };

      mockUserRepository.readById.mockResolvedValue(mockUser);
      mockUserRepository.updateById.mockResolvedValue(verifiedUser);

      const result = await useCase.verifyEmail(props);

      expect(result.isVerified).toBe(true);
      expect(result.verifyToken).toBeUndefined();
      expect(result.verifyTokenExpire).toBeUndefined();
      expect(mockUserRepository.readById).toHaveBeenCalledWith('user-123');
      expect(mockUserRepository.updateById).toHaveBeenCalled();
    });

    it('should throw DatabaseFindError if user not found', async () => {
      const props = { id: 'nonexistent', verifyToken: 'token123' };

      mockUserRepository.readById.mockResolvedValue(null as any);

      await expect(useCase.verifyEmail(props)).rejects.toThrow(DatabaseFindError);
    });

    it('should throw UnauthorizedError for invalid token', async () => {
      const props = { id: 'user-123', verifyToken: 'wrong-token' };

      mockUserRepository.readById.mockResolvedValue(mockUser);

      await expect(useCase.verifyEmail(props)).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for expired token', async () => {
      const expiredUser = { 
        ...mockUser, 
        verifyTokenExpire: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
      };
      const props = { id: 'user-123', verifyToken: 'token123' };

      mockUserRepository.readById.mockResolvedValue(expiredUser);

      await expect(useCase.verifyEmail(props)).rejects.toThrow(UnauthorizedError);
    });

    it('should throw DatabaseActionError if update fails', async () => {
      const props = { id: 'user-123', verifyToken: 'token123' };

      mockUserRepository.readById.mockResolvedValue(mockUser);
      mockUserRepository.updateById.mockResolvedValue(null as any);

      await expect(useCase.verifyEmail(props)).rejects.toThrow(DatabaseActionError);
    });

    it('should handle user without expiry date', async () => {
      const userWithoutExpiry = { ...mockUser, verifyTokenExpire: undefined };
      const props = { id: 'user-123', verifyToken: 'token123' };
      const verifiedUser = { ...userWithoutExpiry, isVerified: true, verifyToken: undefined };

      mockUserRepository.readById.mockResolvedValue(userWithoutExpiry);
      mockUserRepository.updateById.mockResolvedValue(verifiedUser);

      const result = await useCase.verifyEmail(props);

      expect(result.isVerified).toBe(true);
    });
  });
});
