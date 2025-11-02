import { ResponseInterceptor } from '../../../src/shareds/presentation/response.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
    
    mockExecutionContext = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
        getResponse: jest.fn().mockReturnValue({}),
      }),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should wrap successful response in success format', async () => {
    const testData = { message: 'test data' };
    mockCallHandler.handle.mockReturnValue(of(testData));

    const result = await interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .pipe(take(1))
      .toPromise();

    expect(result).toEqual({
      success: true,
      data: testData,
      timestamp: expect.any(Number),
    });
    expect(result.timestamp).toBeGreaterThan(0);
  });

  it('should handle null data', async () => {
    mockCallHandler.handle.mockReturnValue(of(null));

    const result = await interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .pipe(take(1))
      .toPromise();

    expect(result).toEqual({
      success: true,
      data: null,
      timestamp: expect.any(Number),
    });
  });

  it('should handle undefined data', async () => {
    mockCallHandler.handle.mockReturnValue(of(undefined));

    const result = await interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .pipe(take(1))
      .toPromise();

    expect(result).toEqual({
      success: true,
      data: undefined,
      timestamp: expect.any(Number),
    });
  });

  it('should handle empty array data', async () => {
    const emptyArray: any[] = [];
    mockCallHandler.handle.mockReturnValue(of(emptyArray));

    const result = await interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .pipe(take(1))
      .toPromise();

    expect(result).toEqual({
      success: true,
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

    const result = await interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .pipe(take(1))
      .toPromise();

    expect(result).toEqual({
      success: true,
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
