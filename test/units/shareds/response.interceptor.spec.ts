import { ResponseInterceptor } from '../../../src/shareds/presentation/response.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NativeLoggerService } from '../../../src/shareds/presentation/native-logger.service';
import { of, firstValueFrom } from 'rxjs';
import { ResCodes } from '@skrteeeeee/profile-domain';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;
  let reflector: jest.Mocked<Reflector>;
  let logger: jest.Mocked<NativeLoggerService>;

  beforeEach(() => {
    reflector = { get: jest.fn() } as unknown as jest.Mocked<Reflector>;
    logger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setContext: jest.fn(),
    } as unknown as jest.Mocked<NativeLoggerService>;
    interceptor = new ResponseInterceptor<any>(reflector, logger);

    mockExecutionContext = {
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
        getResponse: jest.fn().mockReturnValue({ status: jest.fn() }),
      }),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as any;

    mockCallHandler = {
      handle: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrap successful response in success format', async () => {
    const testData = { message: 'test data' };
    reflector.get.mockReturnValue({ type: ResCodes.OPERATION_SUCCESS, message: 'ok' });
    mockCallHandler.handle.mockReturnValue(of(testData));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    // The interceptor now prioritizes data.message over meta.message
    expect(result).toEqual({
      success: true,
      type: ResCodes.OPERATION_SUCCESS,
      message: 'test data', // Changed: now uses data.message
      data: testData,
      timestamp: expect.any(Number),
    });
    expect(result.timestamp).toBeGreaterThan(0);
  });

  it('should handle null data', async () => {
    reflector.get.mockReturnValue(undefined);
    mockCallHandler.handle.mockReturnValue(of(null));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    expect(result).toEqual({
      success: true,
      type: ResCodes.OPERATION_SUCCESS,
      message: undefined,
      data: null,
      timestamp: expect.any(Number),
    });
  });

  it('should handle undefined data', async () => {
    mockCallHandler.handle.mockReturnValue(of(undefined));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    expect(result).toEqual({
      success: true,
      type: ResCodes.OPERATION_SUCCESS,
      message: undefined,
      data: undefined,
      timestamp: expect.any(Number),
    });
  });

  it('should handle empty array data', async () => {
    const emptyArray: any[] = [];
    mockCallHandler.handle.mockReturnValue(of(emptyArray));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    expect(result).toEqual({
      success: true,
      type: ResCodes.OPERATION_SUCCESS,
      message: undefined,
      data: [],
      timestamp: expect.any(Number),
    });
  });

  it('should handle complex object data', async () => {
    const complexData = {
      id: 'test-123',
      nested: {
        value: 42,
        array: [1, 2, 3],
        boolean: true,
      },
      items: ['item1', 'item2'],
    };
    mockCallHandler.handle.mockReturnValue(of(complexData));

    const result = await firstValueFrom(
      interceptor.intercept(mockExecutionContext, mockCallHandler),
    );

    expect(result).toEqual({
      success: true,
      type: ResCodes.OPERATION_SUCCESS,
      message: undefined,
      data: complexData,
      timestamp: expect.any(Number),
    });
  });

  it('should not interfere with error handling', () => {
    const error = new Error('Test error');
    mockCallHandler.handle.mockReturnValue(
      new (class {
        pipe(mapFn: any) {
          throw error;
        }
      })() as any
    );

    expect(() => {
      interceptor.intercept(mockExecutionContext, mockCallHandler);
    }).toThrow('Test error');
  });
});
