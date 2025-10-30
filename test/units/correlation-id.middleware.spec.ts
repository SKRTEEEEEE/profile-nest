import { CorrelationIdMiddleware } from '../../src/shareds/presentation/correlation-id.middleware';
import { Request, Response, NextFunction } from 'express';

describe('CorrelationIdMiddleware', () => {
  let middleware: CorrelationIdMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    middleware = new CorrelationIdMiddleware();
    mockRequest = {} as any;
    mockResponse = {
      set: jest.fn(),
    } as any;
    mockNext = jest.fn();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should generate a correlation ID', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockRequest['X-Correlation-Id']).toBeDefined();
    expect(typeof mockRequest['X-Correlation-Id']).toBe('string');
  });

  it('should set correlation ID in response header', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.set).toHaveBeenCalledWith(
      'X-Correlation-Id',
      expect.any(String),
    );
  });

  it('should call next middleware', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should generate unique correlation IDs', () => {
    const mockRequest1 = {} as any;
    const mockRequest2 = {} as any;
    const mockResponse1 = { set: jest.fn() } as any;
    const mockResponse2 = { set: jest.fn() } as any;

    middleware.use(mockRequest1, mockResponse1, mockNext);
    middleware.use(mockRequest2, mockResponse2, mockNext);

    expect(mockRequest1['X-Correlation-Id']).not.toEqual(
      mockRequest2['X-Correlation-Id'],
    );
  });
});
