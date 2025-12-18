import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthThirdwebGuard } from 'src/shareds/jwt-auth/presentation/jwt-auth-thirdweb.guard';
import { PUBLIC_ROUTE_KEY } from 'src/shareds/jwt-auth/presentation/public-route.decorator';
import { ROLES_KEY } from 'src/shareds/role-auth/presentation/role.decorator';
import { RoleType } from '@skrteeeeee/profile-domain';

describe('JwtAuthThirdwebGuard', () => {
  let guard: JwtAuthThirdwebGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new JwtAuthThirdwebGuard(reflector);
  });

  describe('canActivate', () => {
    it('should return true for public routes', () => {
      const context = createMockExecutionContext();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(true);

      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });

    it('should call super.canActivate when route is not public', () => {
      const context = createMockExecutionContext();
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(false);
      
      // Mock super.canActivate
      const superCanActivate = jest.spyOn(
        Object.getPrototypeOf(JwtAuthThirdwebGuard.prototype),
        'canActivate',
      );
      superCanActivate.mockReturnValue(true);

      guard.canActivate(context);
      expect(superCanActivate).toHaveBeenCalled();
    });

    it('should warn and ignore public route when both @Roles and @PublicRoute are present', () => {
      const context = createMockExecutionContext();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce(true) // isPublic
        .mockReturnValueOnce([RoleType.STUDENT]); // requiredRoles

      const superCanActivate = jest.spyOn(
        Object.getPrototypeOf(JwtAuthThirdwebGuard.prototype),
        'canActivate',
      );
      superCanActivate.mockReturnValue(true);

      guard.canActivate(context);
      
      expect(consoleWarnSpy).toHaveBeenCalled();
      expect(superCanActivate).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });

    it('should activate for protected routes with roles', () => {
      const context = createMockExecutionContext();
      
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce(false) // isPublic
        .mockReturnValueOnce([RoleType.ADMIN]); // requiredRoles

      const superCanActivate = jest.spyOn(
        Object.getPrototypeOf(JwtAuthThirdwebGuard.prototype),
        'canActivate',
      );
      superCanActivate.mockReturnValue(true);

      guard.canActivate(context);
      expect(superCanActivate).toHaveBeenCalled();
    });
  });

  describe('handleRequest', () => {
    it('should return user when authentication succeeds', () => {
      const user = { userId: '123', address: '0xABC' };
      const result = guard.handleRequest(null, user, null);
      expect(result).toBe(user);
    });

    it('should throw error when user is not present', () => {
      expect(() => {
        guard.handleRequest(null, null, null);
      }).toThrow();
    });

    it('should throw the original error when err is provided', () => {
      const error = new Error('Auth failed');
      expect(() => {
        guard.handleRequest(error, null, null);
      }).toThrow(error);
    });
  });
});

function createMockExecutionContext(): ExecutionContext {
  return {
    getHandler: jest.fn().mockReturnValue({}),
    getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: { authorization: 'Bearer token' },
      }),
    }),
  } as any;
}
