import { PublicRoute } from '../../../src/shareds/jwt-auth/presentation/public-route.decorator';
import { SetMetadata } from '@nestjs/common';

// Mock SetMetadata
jest.mock('@nestjs/common', () => ({
  SetMetadata: jest.fn(),
}));

describe('PublicRoute', () => {
  it('should be defined', () => {
    expect(PublicRoute).toBeDefined();
  });

  it('should call SetMetadata with correct parameters', () => {
    PublicRoute();

    expect(SetMetadata).toHaveBeenCalledWith('isPublic', true);
  });
});
