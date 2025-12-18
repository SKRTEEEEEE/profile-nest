import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleAuthTokenGuard } from 'src/shareds/role-auth/presentation/role-auth-token.guard';
import { RoleAuthUseCase } from 'src/shareds/role-auth/application/role-auth.usecase';
import { RoleType } from '@skrteeeeee/profile-domain';
import { ROLES_KEY } from 'src/shareds/role-auth/presentation/role.decorator';
import { PUBLIC_ROUTE_KEY } from 'src/shareds/jwt-auth/presentation/public-route.decorator';

describe('RoleAuthTokenGuard', () => {
  let guard: RoleAuthTokenGuard;
  let reflector: Reflector;
  let roleAuthUseCase: RoleAuthUseCase;

  beforeEach(() => {
    reflector = new Reflector();
    roleAuthUseCase = {
      validateRoleAccess: jest.fn(),
    } as any;

    guard = new RoleAuthTokenGuard(reflector, roleAuthUseCase);
  });

  describe('canActivate', () => {
    it('should allow access when user has required role', () => {
      const context = createMockExecutionContext(RoleType.ADMIN);
      
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([RoleType.ADMIN]) // requiredRoles
        .mockReturnValueOnce(false); // isPublic

      jest.spyOn(roleAuthUseCase, 'validateRoleAccess').mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(roleAuthUseCase.validateRoleAccess).toHaveBeenCalledWith({
        userRole: RoleType.ADMIN,
        requiredRoles: [RoleType.ADMIN],
        isPublic: false,
        contextName: 'TestController.testMethod',
      });
    });

    it('should deny access when user does not have required role', () => {
      const context = createMockExecutionContext(RoleType.STUDENT);
      
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([RoleType.ADMIN]) // requiredRoles
        .mockReturnValueOnce(false); // isPublic

      jest.spyOn(roleAuthUseCase, 'validateRoleAccess').mockReturnValue(false);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should allow access for public routes', () => {
      const context = createMockExecutionContext(null);
      
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce(undefined) // requiredRoles
        .mockReturnValueOnce(true); // isPublic

      jest.spyOn(roleAuthUseCase, 'validateRoleAccess').mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(roleAuthUseCase.validateRoleAccess).toHaveBeenCalledWith({
        userRole: undefined, // Changed: guard returns undefined when user is null
        requiredRoles: undefined,
        isPublic: true,
        contextName: 'TestController.testMethod',
      });
    });

    it('should handle null user role', () => {
      const context = createMockExecutionContext(null);
      
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([RoleType.STUDENT]) // requiredRoles
        .mockReturnValueOnce(false); // isPublic

      jest.spyOn(roleAuthUseCase, 'validateRoleAccess').mockReturnValue(false);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should handle multiple required roles', () => {
      const context = createMockExecutionContext(RoleType.ADMIN);
      
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([RoleType.ADMIN, RoleType.STUDENT]) // requiredRoles
        .mockReturnValueOnce(false); // isPublic

      jest.spyOn(roleAuthUseCase, 'validateRoleAccess').mockReturnValue(true);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(roleAuthUseCase.validateRoleAccess).toHaveBeenCalledWith({
        userRole: RoleType.ADMIN,
        requiredRoles: [RoleType.ADMIN, RoleType.STUDENT],
        isPublic: false,
        contextName: 'TestController.testMethod',
      });
    });

    it('should handle undefined isPublic as false', () => {
      const context = createMockExecutionContext(RoleType.STUDENT);
      
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([RoleType.STUDENT]) // requiredRoles
        .mockReturnValueOnce(undefined); // isPublic

      jest.spyOn(roleAuthUseCase, 'validateRoleAccess').mockReturnValue(true);

      guard.canActivate(context);

      expect(roleAuthUseCase.validateRoleAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          isPublic: false,
        }),
      );
    });

    it('should pass correct context name', () => {
      const context = createMockExecutionContext(RoleType.STUDENT);
      
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([RoleType.STUDENT])
        .mockReturnValueOnce(false);

      jest.spyOn(roleAuthUseCase, 'validateRoleAccess').mockReturnValue(true);

      guard.canActivate(context);

      expect(roleAuthUseCase.validateRoleAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          contextName: 'TestController.testMethod',
        }),
      );
    });
  });
});

function createMockExecutionContext(userRole: RoleType | null): ExecutionContext {
  return {
    getHandler: jest.fn().mockReturnValue({ name: 'testMethod' }),
    getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        user: userRole ? { ctx: { role: userRole } } : null,
      }),
    }),
  } as any;
}
