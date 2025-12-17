import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../../src/modules/user/presentation/user.controller';
import {
  UserCreateUseCase,
  UserDeleteByIdUseCase,
  UserReadByIdUseCase,
  UserReadOneUseCase,
  UserReadUseCase,
  UserUpdateByIdUseCase,
  UserVerifyEmailUseCase,
} from '../../../../src/modules/user/application/user.usecase';
import { UserNodemailerUpdateUseCase } from '../../../../src/modules/user/application/user-nodemailer.usecase';
import { RoleDeleteByIdUseCase, RoleCreateUseCase } from '../../../../src/modules/role/application/role.usecase';
import { RoleType } from 'src/domain/entities/role.type';

describe('UserController', () => {
  let controller: UserController;
  let userReadByIdService: jest.Mocked<UserReadByIdUseCase>;
  let userReadService: jest.Mocked<UserReadUseCase>;
  let userUpdateByIdService: jest.Mocked<UserUpdateByIdUseCase>;
  let userVerifyEmailService: jest.Mocked<UserVerifyEmailUseCase>;
  let userNodemailerUpdateService: jest.Mocked<UserNodemailerUpdateUseCase>;
  let userCreateService: jest.Mocked<UserCreateUseCase>;
  let userReadOneService: jest.Mocked<UserReadOneUseCase>;
  let roleDeleteByIdService: jest.Mocked<RoleDeleteByIdUseCase>;
  let userDeleteByIdService: jest.Mocked<UserDeleteByIdUseCase>;
  let roleCreateService: jest.Mocked<RoleCreateUseCase>;

  const mockUser = {
    id: 'user-123',
    address: '0x123abc',
    email: 'test@example.com',
    nick: 'tester',
    img: null,
    role: RoleType.STUDENT,
    roleId: null,
    solicitud: null,
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const providers = [
      { provide: UserReadByIdUseCase, useValue: { readById: jest.fn() } },
      { provide: UserReadUseCase, useValue: { read: jest.fn() } },
      { provide: UserUpdateByIdUseCase, useValue: { updateById: jest.fn() } },
      { provide: UserVerifyEmailUseCase, useValue: { verifyEmail: jest.fn() } },
      { provide: UserNodemailerUpdateUseCase, useValue: { update: jest.fn() } },
      { provide: UserCreateUseCase, useValue: { create: jest.fn() } },
      { provide: UserReadOneUseCase, useValue: { readByAddress: jest.fn(), readOne: jest.fn() } },
      { provide: RoleDeleteByIdUseCase, useValue: { deleteById: jest.fn() } },
      { provide: UserDeleteByIdUseCase, useValue: { deleteById: jest.fn() } },
      { provide: RoleCreateUseCase, useValue: { create: jest.fn() } },
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers,
    }).compile();

    controller = module.get<UserController>(UserController);
    userReadByIdService = module.get(UserReadByIdUseCase);
    userReadService = module.get(UserReadUseCase);
    userUpdateByIdService = module.get(UserUpdateByIdUseCase);
    userVerifyEmailService = module.get(UserVerifyEmailUseCase);
    userNodemailerUpdateService = module.get(UserNodemailerUpdateUseCase);
    userCreateService = module.get(UserCreateUseCase);
    userReadOneService = module.get(UserReadOneUseCase);
    roleDeleteByIdService = module.get(RoleDeleteByIdUseCase);
    userDeleteByIdService = module.get(UserDeleteByIdUseCase);
    roleCreateService = module.get(RoleCreateUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('readById', () => {
    it('should return user by id param', async () => {
      userReadByIdService.readById.mockResolvedValue(mockUser as any);

      const result = await controller.readById({ id: 'user-123' });

      expect(result).toEqual(mockUser);
      expect(userReadByIdService.readById).toHaveBeenCalledWith('user-123');
    });
  });

  describe('readAll', () => {
    it('should return every user', async () => {
      userReadService.read.mockResolvedValue([mockUser] as any);

      const result = await controller.readAll();

      expect(result).toEqual([mockUser]);
      expect(userReadService.read).toHaveBeenCalledWith({});
    });
  });

  describe('update', () => {
    it('should delegate to nodemailer update use case', async () => {
      const dto = { id: 'user-123', email: 'new@example.com' } as any;
      userNodemailerUpdateService.update.mockResolvedValue(mockUser as any);

      const result = await controller.update(dto);

      expect(result).toEqual(mockUser);
      expect(userNodemailerUpdateService.update).toHaveBeenCalledWith(dto);
    });
  });

  describe('delete', () => {
    it('should remove user and related role', async () => {
      userReadByIdService.readById.mockResolvedValue({ ...mockUser, roleId: 'role-1' } as any);
      const req = { jwtUser: { ctx: { id: 'user-123' } } } as any;

      await controller.delete(req);

      expect(userReadByIdService.readById).toHaveBeenCalledWith('user-123');
      expect(roleDeleteByIdService.deleteById).toHaveBeenCalledWith('role-1');
      expect(userDeleteByIdService.deleteById).toHaveBeenCalledWith('user-123');
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with provided token', async () => {
      userVerifyEmailService.verifyEmail.mockResolvedValue(mockUser as any);

      const result = await controller.verifyEmail(
        { token: 'token-123' } as any,
        { user: { ctx: { id: 'user-123' } } } as any,
      );

      expect(result).toEqual(mockUser);
      expect(userVerifyEmailService.verifyEmail).toHaveBeenCalledWith({
        id: 'user-123',
        verifyToken: 'token-123',
      });
    });
  });

  describe('manageRole', () => {
    it('should handle request type and update solicitud', async () => {
      userUpdateByIdService.updateById.mockResolvedValue(mockUser as any);

      const result = await controller.manageRole(
        'request' as any,
        { id: 'user-123', solicitud: RoleType.ADMIN } as any,
        { jwtUser: { sub: '0xabc' } } as any,
      );

      expect(result).toEqual(mockUser);
      expect(userUpdateByIdService.updateById).toHaveBeenCalledWith({
        id: 'user-123',
        updateData: { solicitud: RoleType.ADMIN },
      });
    });
  });
});
