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
import { ErrorCodes } from 'src/domain/flows/error.type';
import { UserBase } from 'src/domain/entities/user';

describe('User UseCases', () => {
  let mockUserRepository: jest.Mocked<UserInterface>;
  const mockUser: UserBase & DBBase = {
    address: '0x123',
    nick: 'TestUser',
    img: null,
    email: 'test@example.com',
    roleId: null,
    role: null,
    solicitud: null,
    isVerified: false,
    verifyToken: 'token123',
    verifyTokenExpire: new Date(Date.now() + 3600000).toISOString(),
    paymentId: undefined,
    id: 'user-id-123',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      readOne: jest.fn(),
      read: jest.fn(),
      readById: jest.fn(),
      update: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
    } as any;
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
      const createData: Partial<UserBase> = {
        address: '0x123',
        nick: 'Test User',
        email: 'test@example.com',
      };
      mockUserRepository.create.mockResolvedValue(mockUser);

      const result = await useCase.create(createData);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createData);
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

    it('should read one user by filter', async () => {
      const filter = { email: 'test@example.com' };
      mockUserRepository.readOne.mockResolvedValue(mockUser);

      const result = await useCase.readOne(filter);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.readOne).toHaveBeenCalledWith(filter);
    });

    it('should read user by address', async () => {
      const address = '0x123';
      mockUserRepository.readOne.mockResolvedValue(mockUser);

      const result = await useCase.readByAddress(address);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.readOne).toHaveBeenCalledWith({ address });
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

    it('should read all users without filter', async () => {
      const users = [mockUser];
      mockUserRepository.read.mockResolvedValue(users);

      const result = await useCase.read();

      expect(result).toEqual(users);
      expect(mockUserRepository.read).toHaveBeenCalledWith(undefined);
    });

    it('should read users with filter', async () => {
      const filter = { isVerified: true };
      const users = [mockUser];
      mockUserRepository.read.mockResolvedValue(users);

      const result = await useCase.read(filter);

      expect(result).toEqual(users);
      expect(mockUserRepository.read).toHaveBeenCalledWith(filter);
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

    it('should read user by id', async () => {
      const userId = 'user-id-123';
      mockUserRepository.readById.mockResolvedValue(mockUser);

      const result = await useCase.readById(userId);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.readById).toHaveBeenCalledWith(userId);
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

    it('should update user', async () => {
      const filter = { address: '0x123' };
      const options = { name: 'Updated Name' };
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

    it('should update user by id', async () => {
      const updateProps = {
        id: 'user-id-123',
        updateData: { nick: 'Updated Name' },
      };
      const updatedUser = { ...mockUser, nick: 'Updated Name' };
      mockUserRepository.updateById.mockResolvedValue(updatedUser);

      const result = await useCase.updateById(updateProps);

      expect(result).toEqual(updatedUser);
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

    it('should delete user by id', async () => {
      const userId = 'user-id-123';
      mockUserRepository.deleteById.mockResolvedValue(mockUser);

      const result = await useCase.deleteById(userId);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.deleteById).toHaveBeenCalledWith(userId);
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
      const props = {
        id: 'user-id-123',
        verifyToken: 'token123',
      };
      const verifiedUser = {
        ...mockUser,
        isVerified: true,
        verifyToken: undefined,
        verifyTokenExpire: undefined,
      };

      mockUserRepository.readById.mockResolvedValue(mockUser);
      mockUserRepository.updateById.mockResolvedValue(verifiedUser);

      const result = await useCase.verifyEmail(props);

      expect(result.isVerified).toBe(true);
      expect(result.verifyToken).toBeUndefined();
      expect(result.verifyTokenExpire).toBeUndefined();
      expect(mockUserRepository.readById).toHaveBeenCalledWith(props.id);
      expect(mockUserRepository.updateById).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      const props = {
        id: 'user-id-123',
        verifyToken: 'token123',
      };

      mockUserRepository.readById.mockResolvedValue(null as any);

      await expect(useCase.verifyEmail(props)).rejects.toThrow();
    });

    it('should throw error if verify token does not match', async () => {
      const props = {
        id: 'user-id-123',
        verifyToken: 'wrong-token',
      };

      mockUserRepository.readById.mockResolvedValue(mockUser);

      await expect(useCase.verifyEmail(props)).rejects.toThrow();
    });

    it('should throw error if verify token is expired', async () => {
      const props = {
        id: 'user-id-123',
        verifyToken: 'token123',
      };
      const expiredUser = {
        ...mockUser,
        verifyTokenExpire: new Date(Date.now() - 3600000).toISOString(),
      };

      mockUserRepository.readById.mockResolvedValue(expiredUser);

      await expect(useCase.verifyEmail(props)).rejects.toThrow();
    });

    it('should throw error if update fails', async () => {
      const props = {
        id: 'user-id-123',
        verifyToken: 'token123',
      };

      mockUserRepository.readById.mockResolvedValue(mockUser);
      mockUserRepository.updateById.mockResolvedValue(null as any);

      await expect(useCase.verifyEmail(props)).rejects.toThrow();
    });
  });
});
