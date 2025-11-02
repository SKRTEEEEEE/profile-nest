import { ApiSuccessResponse } from '../../../src/shareds/presentation/api-success.decorator';
import { applyDecorators } from '@nestjs/common';

// Mock applyDecorators
jest.mock('@nestjs/common', () => ({
  applyDecorators: jest.fn(),
}));

describe('ApiSuccessResponse', () => {
  it('should be defined', () => {
    expect(ApiSuccessResponse).toBeDefined();
  });

  it('should call applyDecorators when used', () => {
    const mockClass = class TestClass {};
    const responseCode = 200;
    const isArray = false;

    ApiSuccessResponse(mockClass, responseCode, isArray);

    expect(applyDecorators).toHaveBeenCalled();
  });

  it('should handle array responses', () => {
    const mockClass = class TestClass {};
    const responseCode = 200;
    const isArray = true;

    ApiSuccessResponse(mockClass, responseCode, isArray);

    expect(applyDecorators).toHaveBeenCalled();
  });
});
