import { ApiErrorResponse } from '../../../src/shareds/presentation/api-error.decorator';
import { applyDecorators } from '@nestjs/common';

// Mock applyDecorators
jest.mock('@nestjs/common', () => ({
  applyDecorators: jest.fn(),
}));

describe('ApiErrorResponse', () => {
  it('should be defined', () => {
    expect(ApiErrorResponse).toBeDefined();
  });

  it('should call applyDecorators when used with full errors', () => {
    ApiErrorResponse('full');

    expect(applyDecorators).toHaveBeenCalled();
  });

  it('should call applyDecorators when used with get errors', () => {
    ApiErrorResponse('get');

    expect(applyDecorators).toHaveBeenCalled();
  });

  it('should call applyDecorators when used with get protected errors', () => {
    ApiErrorResponse('get', '--protected');

    expect(applyDecorators).toHaveBeenCalled();
  });
});
