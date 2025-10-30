import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NativeLoggerService } from '../../src/shareds/presentation/native-logger.service';
import { CorrelationIdMiddleware } from '../../src/shareds/presentation/correlation-id.middleware';
import * as request from 'supertest';
import { Controller, Get } from '@nestjs/common';

@Controller('test-logger')
class TestLoggerController {
  constructor(private readonly logger: NativeLoggerService) {}

  @Get('info')
  testInfo() {
    this.logger.log('Test info endpoint', 'TestLoggerController');
    return { message: 'info logged' };
  }

  @Get('error')
  testError() {
    try {
      throw new Error('Intentional test error');
    } catch (error) {
      this.logger.error(
        'Test error endpoint',
        (error as Error).stack,
        'TestLoggerController',
      );
      return { message: 'error logged' };
    }
  }

  @Get('warn')
  testWarn() {
    this.logger.warn('Test warning endpoint', 'TestLoggerController');
    return { message: 'warning logged' };
  }

  @Get('with-correlation')
  testWithCorrelation() {
    this.logger.log('Test with correlation ID', 'TestLoggerController');
    return { message: 'logged with correlation' };
  }
}

@Module({
  controllers: [TestLoggerController],
  providers: [NativeLoggerService],
})
class TestLoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}

describe('Native Logger Integration (e2e)', () => {
  let app: INestApplication;
  let loggerService: NativeLoggerService;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  const originalEnv = process.env.NODE_ENV;

  beforeAll(async () => {
    // Spy on console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('Development Environment', () => {
    beforeAll(async () => {
      process.env.NODE_ENV = 'development';
      
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [TestLoggerModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      
      loggerService = app.get<NativeLoggerService>(NativeLoggerService);
    });

    afterAll(async () => {
      await app.close();
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      expect(loggerService).toBeDefined();
    });

    it('should log info messages through endpoints', async () => {
      await request(app.getHttpServer())
        .get('/test-logger/info')
        .expect(200);

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it('should log errors through endpoints', async () => {
      await request(app.getHttpServer())
        .get('/test-logger/error')
        .expect(200);

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should log warnings through endpoints', async () => {
      await request(app.getHttpServer())
        .get('/test-logger/warn')
        .expect(200);

      expect(consoleWarnSpy).toHaveBeenCalled();
    });

    it('should include correlation ID in responses', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-logger/with-correlation')
        .expect(200);

      expect(response.headers['x-correlation-id']).toBeDefined();
      expect(response.headers['x-correlation-id']).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });

    it('should use colorized output in development', () => {
      loggerService.log('Colorized test', 'E2ETest');
      
      const logCall = consoleLogSpy.mock.calls[0].join(' ');
      // eslint-disable-next-line no-control-regex
      expect(logCall).toMatch(/\x1b\[\d+m/);
    });
  });

  describe('Production Environment', () => {
    beforeAll(async () => {
      process.env.NODE_ENV = 'production';
      
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [TestLoggerModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      
      loggerService = app.get<NativeLoggerService>(NativeLoggerService);
    });

    afterAll(async () => {
      await app.close();
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should output JSON logs in production', async () => {
      await request(app.getHttpServer())
        .get('/test-logger/info')
        .expect(200);

      expect(consoleLogSpy).toHaveBeenCalled();
      
      const logCall = consoleLogSpy.mock.calls[0][0];
      expect(() => JSON.parse(logCall)).not.toThrow();
      
      const logJson = JSON.parse(logCall);
      expect(logJson.level).toBeDefined();
      expect(logJson.message).toBeDefined();
      expect(logJson.timestamp).toBeDefined();
    });

    it('should include stack traces in production error logs', async () => {
      await request(app.getHttpServer())
        .get('/test-logger/error')
        .expect(200);

      expect(consoleErrorSpy).toHaveBeenCalled();
      
      const errorCall = consoleErrorSpy.mock.calls[0][0];
      const errorJson = JSON.parse(errorCall);
      
      expect(errorJson.level).toBe('error');
      expect(errorJson.stack).toBeDefined();
    });

    it('should include correlation ID in production logs', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-logger/with-correlation')
        .expect(200);

      const correlationId = response.headers['x-correlation-id'];
      expect(correlationId).toBeDefined();

      // The logger should have logged with correlation ID
      expect(consoleLogSpy).toHaveBeenCalled();
    });
  });

  describe('Middleware Integration', () => {
    beforeAll(async () => {
      process.env.NODE_ENV = 'development';
      
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [TestLoggerModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should add correlation ID to all requests', async () => {
      const response1 = await request(app.getHttpServer())
        .get('/test-logger/info')
        .expect(200);

      const response2 = await request(app.getHttpServer())
        .get('/test-logger/info')
        .expect(200);

      const correlationId1 = response1.headers['x-correlation-id'];
      const correlationId2 = response2.headers['x-correlation-id'];

      expect(correlationId1).toBeDefined();
      expect(correlationId2).toBeDefined();
      expect(correlationId1).not.toBe(correlationId2);
    });

    it('should maintain correlation ID throughout request lifecycle', async () => {
      const response = await request(app.getHttpServer())
        .get('/test-logger/with-correlation')
        .expect(200);

      const correlationId = response.headers['x-correlation-id'];
      
      expect(correlationId).toBeDefined();
      expect(correlationId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      );
    });
  });

  describe('Error Handling', () => {
    beforeAll(async () => {
      process.env.NODE_ENV = 'development';
      
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [TestLoggerModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      
      loggerService = app.get<NativeLoggerService>(NativeLoggerService);
    });

    afterAll(async () => {
      await app.close();
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should handle logging errors gracefully', () => {
      const error = new Error('Test error with details');
      
      expect(() => {
        loggerService.error(error, error.stack, 'ErrorTest');
      }).not.toThrow();
    });

    it('should handle circular reference objects', () => {
      const circular: any = { name: 'test' };
      circular.self = circular;
      
      expect(() => {
        loggerService.log(circular, 'CircularTest');
      }).not.toThrow();
    });

    it('should handle undefined or null values', () => {
      expect(() => {
        loggerService.log(undefined as any, 'UndefinedTest');
        loggerService.log(null as any, 'NullTest');
      }).not.toThrow();
    });
  });
});
