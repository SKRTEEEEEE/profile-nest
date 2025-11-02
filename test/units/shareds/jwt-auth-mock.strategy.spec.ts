import { JwtAuthMockStrategy } from 'src/shareds/jwt-auth/presentation/jwt-auth-mock.strategy';
import { Request } from 'express';

describe('JwtAuthMockStrategy', () => {
  let strategy: JwtAuthMockStrategy;

  beforeEach(() => {
    strategy = new JwtAuthMockStrategy();
  });

  describe('validate', () => {
    it('should extract and return JWT payload from Bearer token', async () => {
      const mockPayload = {
        userId: '123',
        address: '0xABC',
        ctx: { role: 'user' },
      };

      const req = {
        headers: {
          authorization: `Bearer ${JSON.stringify(mockPayload)}`,
        },
      } as Request;

      const result = await strategy.validate(req);
      expect(result).toEqual(mockPayload);
    });

    it('should throw error when no authorization header is present', async () => {
      const req = {
        headers: {},
      } as Request;

      await expect(strategy.validate(req)).rejects.toThrow();
    });

    it('should throw error when authorization header is empty', async () => {
      const req = {
        headers: {
          authorization: '',
        },
      } as Request;

      await expect(strategy.validate(req)).rejects.toThrow();
    });

    it('should throw error when Bearer prefix is missing', async () => {
      const req = {
        headers: {
          authorization: 'InvalidFormat',
        },
      } as Request;

      await expect(strategy.validate(req)).rejects.toThrow();
    });

    it('should throw error when token is empty', async () => {
      const req = {
        headers: {
          authorization: 'Bearer ',
        },
      } as Request;

      await expect(strategy.validate(req)).rejects.toThrow();
    });

    it('should throw error when token is invalid JSON', async () => {
      const req = {
        headers: {
          authorization: 'Bearer {invalid-json}',
        },
      } as Request;

      await expect(strategy.validate(req)).rejects.toThrow();
    });

    it('should handle complex nested payload', async () => {
      const mockPayload = {
        userId: '456',
        address: '0xDEF',
        ctx: {
          role: 'admin',
          permissions: ['read', 'write'],
          metadata: {
            createdAt: '2025-01-01',
          },
        },
      };

      const req = {
        headers: {
          authorization: `Bearer ${JSON.stringify(mockPayload)}`,
        },
      } as Request;

      const result = await strategy.validate(req);
      expect(result).toEqual(mockPayload);
    });
  });
});
