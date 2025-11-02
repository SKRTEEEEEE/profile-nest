import { JwtAuthUseCase } from '../../../src/shareds/jwt-auth/application/jwt-auth.usecase';
import { JwtAuthInterface } from '../../../src/shareds/jwt-auth/application/jwt-auth.interface';

describe('JwtAuthUseCase', () => {
  let useCase: JwtAuthUseCase;
  let mockJwtAuthRepository: jest.Mocked<JwtAuthInterface>;

  beforeEach(() => {
    mockJwtAuthRepository = {
      verifyJWT: jest.fn(),
    } as jest.Mocked<JwtAuthInterface>;

    useCase = new JwtAuthUseCase(mockJwtAuthRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('verifyJWT', () => {
    it('should verify JWT token successfully', async () => {
      const token = 'valid-jwt-token';
      const expectedResult = { 
        valid: true, 
        parsedJWT: { 
          iss: 'test-issuer',
          sub: '123',
          aud: 'test-audience',
          exp: Date.now() + 3600000,
          nbf: Date.now(),
          iat: Date.now(),
          jti: 'test-jti',
          ctx: { userId: '123', address: '0xabc...' }
        } 
      };

      mockJwtAuthRepository.verifyJWT.mockResolvedValue(expectedResult);

      const result = await useCase.verifyJWT(token);

      expect(result).toEqual(expectedResult);
      expect(mockJwtAuthRepository.verifyJWT).toHaveBeenCalledWith(token);
    });

    it('should handle invalid JWT token', async () => {
      const token = 'invalid-jwt-token';

      mockJwtAuthRepository.verifyJWT.mockResolvedValue(null);

      const result = await useCase.verifyJWT(token);

      expect(result).toBeNull();
      expect(mockJwtAuthRepository.verifyJWT).toHaveBeenCalledWith(token);
    });

    it('should handle repository errors', async () => {
      const token = 'any-token';
      const error = new Error('JWT verification failed');

      mockJwtAuthRepository.verifyJWT.mockRejectedValue(error);

      await expect(useCase.verifyJWT(token)).rejects.toThrow('JWT verification failed');
      expect(mockJwtAuthRepository.verifyJWT).toHaveBeenCalledWith(token);
    });

    it('should handle empty token', async () => {
      const token = '';

      mockJwtAuthRepository.verifyJWT.mockResolvedValue(undefined);

      const result = await useCase.verifyJWT(token);

      expect(result).toBeUndefined();
      expect(mockJwtAuthRepository.verifyJWT).toHaveBeenCalledWith(token);
    });
  });
});
