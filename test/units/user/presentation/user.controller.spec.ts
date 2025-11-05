import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../../src/modules/user/presentation/user.controller';
import { UserUseCase } from '../../../../src/modules/user/application/user.usecase';
import { UserNodemailerUseCase } from '../../../../src/modules/user/application/user-nodemailer.usecase';

describe('UserController', () => {
  let controller: UserController;
  let userUseCase: jest.Mocked<UserUseCase>;
  let userNodemailerUseCase: jest.Mocked<UserNodemailerUseCase>;

  const mockUser = {
    id: 'user-123',
    address: '0x123abc',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const mockUserUseCase = {
      create: jest.fn(),
      readById: jest.fn(),
      readByAddress: jest.fn(),
      readOne: jest.fn(),
      updateById: jest.fn(),
      delete: jest.fn(),
    };

    const mockUserNodemailerUseCase = {
      sendVerificationEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserUseCase,
          useValue: mockUserUseCase,
        },
        {
          provide: UserNodemailerUseCase,
          useValue: mockUserNodemailerUseCase,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userUseCase = module.get(UserUseCase);
    userNodemailerUseCase = module.get(UserNodemailerUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto = {
        address: '0x123abc',
        email: 'test@example.com',
        name: 'Test User',
      };
      userUseCase.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userUseCase.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('readById', () => {
    it('should return user by id', async () => {
      const userId = 'user-123';
      userUseCase.readById.mockResolvedValue(mockUser);

      const result = await controller.readById(userId);

      expect(result).toEqual(mockUser);
      expect(userUseCase.readById).toHaveBeenCalledWith(userId);
    });
  });

  describe('readByAddress', () => {
    it('should return user by address', async () => {
      const address = '0x123abc';
      userUseCase.readByAddress.mockResolvedValue(mockUser);

      const result = await controller.readByAddress(address);

      expect(result).toEqual(mockUser);
      expect(userUseCase.readByAddress).toHaveBeenCalledWith(address);
    });
  });

  describe('updateById', () => {
    it('should update user by id', async () => {
      const userId = 'user-123';
      const updateData = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      userUseCase.updateById.mockResolvedValue(updatedUser);

      const result = await controller.updateById(userId, updateData);

      expect(result).toEqual(updatedUser);
      expect(userUseCase.updateById).toHaveBeenCalledWith({
        id: userId,
        updateData,
      });
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      const userId = 'user-123';
      userUseCase.delete.mockResolvedValue(mockUser);

      const result = await controller.delete(userId);

      expect(result).toEqual(mockUser);
      expect(userUseCase.delete).toHaveBeenCalledWith({ filter: { id: userId } });
    });
  });
});
