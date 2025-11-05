import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SignatureAuthThirdWebGuard } from 'src/shareds/signature-auth/presentation/signature-auth-thirdweb.guard';
import { AuthThirdWebRepo } from 'src/shareds/thirdweb/auth-thirdweb.repo';

describe('SignatureAuthThirdWebGuard', () => {
  let guard: SignatureAuthThirdWebGuard;
  let authRepo: AuthThirdWebRepo;
  let reflector: Reflector;

  beforeEach(() => {
    authRepo = {
      verifyPayload: jest.fn(),
    } as any;

    reflector = new Reflector();
    guard = new SignatureAuthThirdWebGuard(authRepo, reflector);
  });

  describe('canActivate', () => {
    it('should return true when JWT_STRATEGY is mock', async () => {
      process.env.JWT_STRATEGY = 'mock';
      const context = createMockExecutionContext({});

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      delete process.env.JWT_STRATEGY;
    });

    it('should verify valid signed payload and return true', async () => {
      delete process.env.JWT_STRATEGY;
      
      const mockPayload = { userId: '123', signature: 'valid-sig' };
      const context = createMockExecutionContext({
        'x-signed-payload': JSON.stringify(mockPayload),
      });

      jest.spyOn(authRepo, 'verifyPayload').mockResolvedValue({
        valid: true,
        payload: mockPayload,
      } as any);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(authRepo.verifyPayload).toHaveBeenCalledWith(mockPayload);
    });

    it('should throw error when signed payload header is missing', async () => {
      delete process.env.JWT_STRATEGY;
      const context = createMockExecutionContext({});

      await expect(guard.canActivate(context)).rejects.toThrow();
    });

    it('should throw error when signed payload is invalid JSON', async () => {
      delete process.env.JWT_STRATEGY;
      const context = createMockExecutionContext({
        'x-signed-payload': 'invalid-json',
      });

      await expect(guard.canActivate(context)).rejects.toThrow();
    });

    it('should throw error when payload verification fails', async () => {
      delete process.env.JWT_STRATEGY;
      
      const mockPayload = { userId: '123', signature: 'invalid-sig' };
      const context = createMockExecutionContext({
        'x-signed-payload': JSON.stringify(mockPayload),
      });

      jest.spyOn(authRepo, 'verifyPayload').mockResolvedValue({
        valid: false,
      } as any);

      await expect(guard.canActivate(context)).rejects.toThrow();
    });

    it('should attach verified payload to request when valid', async () => {
      delete process.env.JWT_STRATEGY;
      
      const mockPayload = { userId: '123', signature: 'valid-sig' };
      const mockRequest = {
        headers: { 'x-signed-payload': JSON.stringify(mockPayload) },
      };
      
      const context = createMockExecutionContext(
        { 'x-signed-payload': JSON.stringify(mockPayload) },
        mockRequest,
      );

      const mockVerified = {
        valid: true,
        payload: mockPayload,
      };

      jest.spyOn(authRepo, 'verifyPayload').mockResolvedValue(mockVerified as any);

      await guard.canActivate(context);

      expect(mockRequest['verifiedPayload']).toEqual(mockVerified);
    });

    it('should handle empty signed payload string', async () => {
      delete process.env.JWT_STRATEGY;
      const context = createMockExecutionContext({
        'x-signed-payload': '',
      });

      await expect(guard.canActivate(context)).rejects.toThrow();
    });

    it('should handle malformed JSON in payload', async () => {
      delete process.env.JWT_STRATEGY;
      const context = createMockExecutionContext({
        'x-signed-payload': '{invalid: json}',
      });

      await expect(guard.canActivate(context)).rejects.toThrow();
    });
  });
});

function createMockExecutionContext(
  headers: Record<string, string>,
  customRequest?: any,
): ExecutionContext {
  const request = customRequest || { headers };
  
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue(request),
    }),
  } as any;
}
