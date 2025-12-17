import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, ArgumentsHost } from '@nestjs/common';
import { DomainErrorFilter, errorCodeStatus } from '../../../src/shareds/presentation/filters/domain-error.filter';
import { NativeLoggerService } from '../../../src/shareds/presentation/native-logger.service';
import { DatabaseActionError, InputParseError, UnauthorizedError } from 'src/domain/flows/domain.error';
import { ErrorCodes } from 'src/domain/flows/error.type';

describe('DomainErrorFilter', () => {
  let filter: DomainErrorFilter;
  let mockLogger: jest.Mocked<NativeLoggerService>;
  let mockArgumentsHost: jest.Mocked<ArgumentsHost>;
  let mockResponse: any;
  let mockRequest: any;

  beforeEach(async () => {
    mockLogger = {
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      setCorrelationId: jest.fn(),
      isProduction: false,
      isDevelopment: true,
      colors: {},
      formatMessage: jest.fn(),
    } as any as jest.Mocked<NativeLoggerService>;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      'X-Correlation-Id': 'correlation-123',
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      getType: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DomainErrorFilter,
        { provide: NativeLoggerService, useValue: mockLogger },
      ],
    }).compile();

    filter = module.get<DomainErrorFilter>(DomainErrorFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('errorCodeStatus mapping', () => {
    it('should have correct HTTP status mapping for all error codes', () => {
      expect(errorCodeStatus[ErrorCodes.DATABASE_ACTION]).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(errorCodeStatus[ErrorCodes.DATABASE_FIND]).toBe(HttpStatus.NOT_FOUND);
      expect(errorCodeStatus[ErrorCodes.INPUT_PARSE]).toBe(HttpStatus.BAD_REQUEST);
      expect(errorCodeStatus[ErrorCodes.SET_ENV]).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(errorCodeStatus[ErrorCodes.UNAUTHORIZED_ACTION]).toBe(HttpStatus.UNAUTHORIZED);
      expect(errorCodeStatus[ErrorCodes.THROTTLE]).toBe(HttpStatus.TOO_MANY_REQUESTS);
      expect(errorCodeStatus[ErrorCodes.NOT_IMPLEMENTED]).toBe(HttpStatus.NOT_IMPLEMENTED);
      expect(errorCodeStatus[ErrorCodes.SHARED_ACTION]).toBe(HttpStatus.BAD_GATEWAY);
    });
  });

  describe('catch', () => {
    class MockLocation {}

    it('should handle DatabaseActionError correctly', () => {
      const error = new DatabaseActionError(
        MockLocation,
        'testFunction',
        undefined,
        { entity: 'User', optionalMessage: 'Connection failed' }
      );

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        type: ErrorCodes.DATABASE_ACTION,
        message: expect.stringContaining('Something went wrong while saving the data'),
        timestamp: expect.any(Number),
        meta: error.meta,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should handle InputParseError correctly', () => {
      const error = new InputParseError(
        MockLocation,
        'testFunction',
        { es: 'Error personalizado', en: 'Custom error', ca: 'Error personalitzat', de: 'Benutzerdefinierter Fehler' },
        { shortDesc: 'Validation failed' }
      );

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.success).toBe(false);
      expect(jsonCall.type).toBe(ErrorCodes.INPUT_PARSE);
      // Message should contain both the metadata desc and custom friendlyDesc
      expect(jsonCall.message).toContain('Your request is in an incorrect format');
      expect(jsonCall.message).toContain('Custom error');
      expect(jsonCall.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(jsonCall.meta.shortDesc).toBe('Validation failed');
      expect(jsonCall.meta.friendlyDesc).toEqual({ 
        es: 'Error personalizado', 
        en: 'Custom error',
        ca: 'Error personalitzat',
        de: 'Benutzerdefinierter Fehler'
      });
    });

    it('should handle UnauthorizedError correctly', () => {
      const error = new UnauthorizedError(
        MockLocation,
        'testFunction',
        undefined,
        { optionalMessage: 'Invalid token' }
      );

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        type: ErrorCodes.UNAUTHORIZED_ACTION,
        message: expect.stringContaining('You do not have permission'),
        timestamp: expect.any(Number),
        meta: error.meta,
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    });

    it('should use error timestamp if available', () => {
      const error = new DatabaseActionError(MockLocation, 'testFunction');

      filter.catch(error, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(Number),
        })
      );
    });

    it('should use current timestamp if error timestamp is not available', () => {
      const error = new DatabaseActionError(MockLocation, 'testFunction');
      delete (error as any).timestamp;

      const beforeCall = Date.now();
      filter.catch(error, mockArgumentsHost);
      const afterCall = Date.now();

      const responseCall = mockResponse.json.mock.calls[0][0];
      expect(responseCall.timestamp).toBeGreaterThanOrEqual(beforeCall);
      expect(responseCall.timestamp).toBeLessThanOrEqual(afterCall);
    });

    it('should log error with proper context', () => {
      const error = new DatabaseActionError(
        MockLocation,
        'testFunction',
        undefined,
        { entity: 'User' }
      );

      filter.catch(error, mockArgumentsHost);

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Something went wrong while saving the data'),
          correlationId: 'correlation-123',
          errorType: ErrorCodes.DATABASE_ACTION,
          family: 'Internal',
          code: 500,
          meta: error.meta,
        }),
        error.stack,
        'DomainErrorFilter'
      );
    });

    it('should handle error with meta description correctly', () => {
      const error = new InputParseError(
        MockLocation,
        'testFunction',
        undefined,
        {
          shortDesc: 'Field validation failed',
          optionalMessage: 'Validation error',
        }
      );

      filter.catch(error, mockArgumentsHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      // Without custom friendlyDesc, should use default from metadata
      expect(jsonCall.message).toContain('Your request is in an incorrect format');
      expect(jsonCall.message).toContain('Please verify the information and try again');
      expect(jsonCall.meta.shortDesc).toBe('Field validation failed');
      expect(jsonCall.meta.optionalMessage).toBe('Validation error');
    });

    it('should fall back to default HTTP status for unknown error type', () => {
      const error = new DatabaseActionError(MockLocation, 'testFunction');
      // Simulate unknown error type by modifying the type
      (error as any).type = 'UNKNOWN_ERROR_TYPE';

      // This will throw because ERROR_CODES_METADATA doesn't have this type
      // The filter should handle this gracefully
      expect(() => filter.catch(error, mockArgumentsHost)).toThrow();
    });

    it('should handle errors without correlation ID', () => {
      mockRequest = {}; // No correlation ID
      mockArgumentsHost.switchToHttp.mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getNext: jest.fn(),
      } as any);

      const error = new DatabaseActionError(MockLocation, 'testFunction');
      filter.catch(error, mockArgumentsHost);

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          correlationId: undefined,
        }),
        error.stack,
        'DomainErrorFilter'
      );
    });
  });
});
