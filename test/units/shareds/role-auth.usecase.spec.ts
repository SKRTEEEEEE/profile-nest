import { ForbiddenException } from '@nestjs/common';
import { RoleAuthUseCase } from '../../../src/shareds/role-auth/application/role-auth.usecase';
import { RoleType } from 'src/domain/entities/role.type';

describe('RoleAuthUseCase', () => {
  let useCase: RoleAuthUseCase;

  beforeEach(() => {
    useCase = new RoleAuthUseCase();
  });

  it('should allow public routes even without roles', () => {
    const canAccess = useCase.validateRoleAccess({
      userRole: null,
      requiredRoles: undefined,
      isPublic: true,
      contextName: 'Test',
    });

    expect(canAccess).toBe(true);
  });

  it('should throw when user role missing for protected route', () => {
    expect(() =>
      useCase.validateRoleAccess({
        userRole: null,
        requiredRoles: [RoleType.ADMIN],
        isPublic: false,
      }),
    ).toThrow(ForbiddenException);
  });

  it('should allow when user role meets hierarchy requirements', () => {
    const result = useCase.validateRoleAccess({
      userRole: RoleType.ADMIN,
      requiredRoles: [RoleType.STUDENT],
      isPublic: false,
    });

    expect(result).toBe(true);
  });

  it('should reject when user lacks privileges', () => {
    expect(() =>
      useCase.validateRoleAccess({
        userRole: RoleType.STUDENT,
        requiredRoles: [RoleType.ADMIN],
        isPublic: false,
      }),
    ).toThrow(ForbiddenException);
  });

  it('should warn when multiple roles provided but still evaluate', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

    const result = useCase.validateRoleAccess({
      userRole: RoleType.ADMIN,
      requiredRoles: [RoleType.ADMIN, RoleType.STUDENT],
      isPublic: false,
      contextName: 'TestController.method',
    });

    expect(result).toBe(true);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
