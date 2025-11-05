import { JwtAuthThirdwebStrategy } from 'src/shareds/jwt-auth/presentation/jwt-auth-thirdweb.strategy';
import { JwtAuthUseCase } from 'src/shareds/jwt-auth/application/jwt-auth.usecase';
import { Request } from 'express';

describe('JwtAuthThirdwebStrategy', () => {
  let strategy: JwtAuthThirdwebStrategy;
  let jwtAuthUseCase: JwtAuthUseCase;

  beforeEach(() => {
    jwtAuthUseCase = {
      verifyJWT: jest.fn(),
    } as any;

    strategy = new JwtAuthThirdwebStrategy(jwtAuthUseCase);
  });

  describe('validate', () => {
    it('should validate and return payload when token is valid', async () => {
      const mockPayload = {
        parsedJWT: {
          userId: '123',
          address: '0xABC',
        },
      };

      jest.spyOn(jwtAuthUseCase, 'verifyJWT').mockResolvedValue(mockPayload as any);

      const req = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      } as Request;

      const result = await strategy.validate(req);
      expect(result).toEqual(mockPayload.parsedJWT);
      expect(jwtAuthUseCase.verifyJWT).toHaveBeenCalledWith('valid-token');
    });

    it('should throw error when no token is provided', async () => {
      const req = {
        headers: {},
      } as Request;

      await expect(strategy.validate(req)).rejects.toThrow();
    });

    it('should throw error when authorization header is malformed', async () => {
      const req = {
        headers: {
          authorization: 'InvalidFormat',
        },
      } as Request;

      await expect(strategy.validate(req)).rejects.toThrow();
    });

    it('should throw error when token verification fails', async () => {
      jest.spyOn(jwtAuthUseCase, 'verifyJWT').mockRejectedValue(new Error('Invalid token'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const req = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      } as Request;

      await expect(strategy.validate(req)).rejects.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });

    it('should handle empty authorization header', async () => {
      const req = {
        headers: {
          authorization: '',
        },
      } as Request;

      await expect(strategy.validate(req)).rejects.toThrow();
    });

    it('should handle Bearer prefix without token', async () => {
      const req = {
        headers: {
          authorization: 'Bearer ',
        },
      } as Request;

      await expect(strategy.validate(req)).rejects.toThrow();
    });
  });
});
