import { NativeLoggerService } from '../../src/shareds/presentation/native-logger.service';

describe('NativeLoggerService', () => {
  let service: NativeLoggerService;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;
  const originalEnv = process.env.NODE_ENV;
  const originalLogLevel = process.env.LOG_LEVEL;
  const originalJwtStrategy = process.env.JWT_STRATEGY;

  const restoreEnv = () => {
    if (originalEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalEnv;
    }

    if (originalLogLevel === undefined) {
      delete process.env.LOG_LEVEL;
    } else {
      process.env.LOG_LEVEL = originalLogLevel;
    }

    if (originalJwtStrategy === undefined) {
      delete process.env.JWT_STRATEGY;
    } else {
      process.env.JWT_STRATEGY = originalJwtStrategy;
    }
  };

  const instantiateLogger = () => {
    service = new NativeLoggerService();
    return service;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.LOG_LEVEL;
    delete process.env.JWT_STRATEGY;

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    restoreEnv();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  describe('Basic Logging', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      instantiateLogger();
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should log info messages', () => {
      const message = 'Test info message';
      const context = 'TestContext';
      
      service.log(message, context);
      
      expect(consoleLogSpy).toHaveBeenCalled();
      const logCall = consoleLogSpy.mock.calls[0];
      expect(logCall.join(' ')).toContain(message);
      expect(logCall.join(' ')).toContain(context);
    });

    it('should log error messages', () => {
      const message = 'Test error message';
      const stack = 'Error stack trace';
      const context = 'TestContext';
      
      service.error(message, stack, context);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log warning messages', () => {
      const message = 'Test warning message';
      const context = 'TestContext';
      
      service.warn(message, context);
      
      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should log debug messages', () => {
      const message = 'Test debug message';
      const context = 'TestContext';
      
      service.debug(message, context);
      
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should log verbose messages', () => {
      const message = 'Test verbose message';
      const context = 'TestContext';
      
      service.verbose(message, context);
      
      expect(consoleDebugSpy).toHaveBeenCalled();
    });

    it('should handle object messages', () => {
      const messageObj = { message: 'Object message', data: { key: 'value' } };
      const context = 'TestContext';
      
      service.log(messageObj, context);
      
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle Error instances', () => {
      const error = new Error('Test error instance');
      const context = 'TestContext';
      
      service.error(error, error.stack, context);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('Development Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      instantiateLogger();
    });

    it('should show colorized output in development', () => {
      const message = 'Dev message';
      const context = 'DevContext';

      service.log(message, context);

      const logCall = consoleLogSpy.mock.calls[0].join(' ');
      // eslint-disable-next-line no-control-regex
      expect(logCall).toMatch(/\x1b\[\d+m/);
    });

    it('should display stack traces in development', () => {
      const message = 'Error with stack';
      const stack = 'Error: Test\n  at Object.<anonymous> (test.ts:1:1)';
      const context = 'ErrorContext';

      service.error(message, stack, context);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorCall = consoleErrorSpy.mock.calls[0].join(' ');
      expect(errorCall).toContain(stack);
    });

    it('should show debug logs in development', () => {
      service.debug('Debug message', 'DebugContext');

      expect(consoleDebugSpy).toHaveBeenCalled();
    });
  });

  describe('Production Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      instantiateLogger();
    });

    it('should output JSON format in production', () => {
      const message = 'Production message';
      const context = 'ProdContext';
      
      service.log(message, context);
      
      const logCall = consoleLogSpy.mock.calls[0][0];
      
      // In production, should output JSON
      expect(() => JSON.parse(logCall)).not.toThrow();
      
      const logJson = JSON.parse(logCall);
      expect(logJson.level).toBe('log');
      expect(logJson.message).toBe(message);
      expect(logJson.context).toBe(context);
      expect(logJson.timestamp).toBeDefined();
    });

    it('should include stack trace in production JSON', () => {
      const message = 'Production error';
      const stack = 'Error stack trace';
      const context = 'ErrorContext';
      
      service.error(message, stack, context);
      
      const errorCall = consoleErrorSpy.mock.calls[0][0];
      const errorJson = JSON.parse(errorCall);
      
      expect(errorJson.level).toBe('error');
      expect(errorJson.message).toBe(message);
      expect(errorJson.stack).toBe(stack);
      expect(errorJson.context).toBe(context);
    });

    it('should not display debug logs in production by default', () => {
      service.debug('Debug message', 'DebugContext');
      
      // Debug should not be logged in production
      expect(consoleDebugSpy).not.toHaveBeenCalled();
    });

    it('should include timestamp in production logs', () => {
      service.log('Test timestamp', 'Context');
      
      const logCall = consoleLogSpy.mock.calls[0][0];
      const logJson = JSON.parse(logCall);
      
      expect(logJson.timestamp).toBeDefined();
      expect(new Date(logJson.timestamp).getTime()).toBeGreaterThan(0);
    });
  });

  describe('Correlation ID Support', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      instantiateLogger();
    });

    it('should accept and log correlation ID', () => {
      const correlationId = 'test-correlation-id-123';
      service.setCorrelationId(correlationId);
      
      service.log('Test with correlation', 'TestContext');
      
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should include correlation ID in production logs', () => {
      process.env.NODE_ENV = 'production';
      instantiateLogger();
      const correlationId = 'correlation-abc-123';

      service.setCorrelationId(correlationId);
      service.log('Message with correlation', 'Context');

      const logCall = consoleLogSpy.mock.calls[0][0];
      const logJson = JSON.parse(logCall);

      expect(logJson.correlationId).toBe(correlationId);
    });
  });

  describe('Special Cases', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      instantiateLogger();
    });

    it('should handle undefined context', () => {
      service.log('Message without context');
      
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should handle null messages gracefully', () => {
      expect(() => {
        service.log(null as any);
      }).not.toThrow();
    });

    it('should handle circular references in objects', () => {
      const circular: any = { name: 'test' };
      circular.self = circular;
      
      expect(() => {
        service.log(circular, 'CircularContext');
      }).not.toThrow();
    });

    it('should handle very long messages', () => {
      const longMessage = 'A'.repeat(10000);
      
      expect(() => {
        service.log(longMessage, 'LongContext');
      }).not.toThrow();
    });
  });
});
