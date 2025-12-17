import { ErrorCodes } from 'src/domain/flows/error.type';

// Mock dependencies before importing the decorator
jest.mock('@nestjs/common', () => ({
  applyDecorators: jest.fn((...args) => args),
}));

jest.mock('@nestjs/swagger', () => ({
  ApiExtraModels: jest.fn(() => jest.fn()),
  ApiResponse: jest.fn(() => jest.fn()),
}));

// Now import the decorator after mocks are set up
import { ApiErrorResponse } from '../../../src/shareds/presentation/api-error.decorator';
import { applyDecorators } from '@nestjs/common';

describe('ApiErrorResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(ApiErrorResponse).toBeDefined();
  });

  it('should return a decorator function when used with full errors', () => {
    const decorator = ApiErrorResponse('full');

    expect(typeof decorator).toBe('function');
  });

  it('should return a decorator function when used with get errors', () => {
    const decorator = ApiErrorResponse('get');

    expect(typeof decorator).toBe('function');
  });

  it('should return a decorator function when used with specific error codes', () => {
    const decorator = ApiErrorResponse(ErrorCodes.DATABASE_FIND);

    expect(typeof decorator).toBe('function');
  });

  it('should apply the decorator to a method', () => {
    class TestController {
      testMethod() {
        return 'test';
      }
    }

    const decorator = ApiErrorResponse('get');
    const descriptor = Object.getOwnPropertyDescriptor(TestController.prototype, 'testMethod');
    
    expect(() => decorator(TestController.prototype, 'testMethod', descriptor!)).not.toThrow();
  });
});
