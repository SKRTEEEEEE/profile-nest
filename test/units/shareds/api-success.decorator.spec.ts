import { ApiSuccessResponse } from '../../../src/shareds/presentation/api-success.decorator';
import { ResCodes } from '@skrteeeeee/profile-domain';
import { applyDecorators } from '@nestjs/common';

// Mock applyDecorators
jest.mock('@nestjs/common', () => ({
  applyDecorators: jest.fn(),
  SetMetadata: jest.fn(),
}));

describe('ApiSuccessResponse', () => {
  it('should be defined', () => {
    expect(ApiSuccessResponse).toBeDefined();
  });

  it('should call applyDecorators when used', () => {
    const mockClass = class TestClass {};
    const responseCode = ResCodes.ENTITY_FOUND;
    const isArray = false;

    ApiSuccessResponse(mockClass, responseCode, isArray);

    expect(applyDecorators).toHaveBeenCalled();
  });

  it('should handle array responses', () => {
    const mockClass = class TestClass {};
    const responseCode = ResCodes.ENTITY_FOUND;
    const isArray = true;

    ApiSuccessResponse(mockClass, responseCode, isArray);

    expect(applyDecorators).toHaveBeenCalled();
  });
});
