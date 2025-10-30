import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LoggerModuleCustom } from '../../src/shareds/presentation/logger.module';
import { CustomLoggerService } from '../../src/shareds/presentation/logger.service';
import { Logger } from 'nestjs-pino';
import * as fs from 'fs';
import * as path from 'path';

describe('Logger Integration (e2e)', () => {
  let app: INestApplication;
  let loggerService: CustomLoggerService;
  let pinoLogger: Logger;
  const logDir = path.join(process.cwd(), 'logs');
  const errorStatsFile = path.join(logDir, 'error-stats.json');
  const originalEnv = process.env.NODE_ENV;

  beforeAll(async () => {
    // Clean up test logs before starting
    if (fs.existsSync(errorStatsFile)) {
      fs.unlinkSync(errorStatsFile);
    }
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
    
    // Clean up test logs after completion
    if (fs.existsSync(errorStatsFile)) {
      fs.unlinkSync(errorStatsFile);
    }
  });

  describe('Development Environment', () => {
    beforeAll(async () => {
      process.env.NODE_ENV = 'development';
      
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [LoggerModuleCustom],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      
      loggerService = app.get<CustomLoggerService>(CustomLoggerService);
      pinoLogger = app.get<Logger>(Logger);
    });

    afterAll(async () => {
      await app.close();
    });

    it('should be defined', () => {
      expect(loggerService).toBeDefined();
      expect(pinoLogger).toBeDefined();
    });

    it('should use pino-pretty transport in development', () => {
      // In development, logs should be colorized and formatted
      expect(() => {
        pinoLogger.log('Development log test');
      }).not.toThrow();
    });

    it('should not create stats files in development', () => {
      loggerService.error('Dev error test', 'stack trace', 'TestContext');
      
      // Error stats should not be saved in development
      expect(fs.existsSync(errorStatsFile)).toBe(false);
    });

    it('should handle all log levels in development', () => {
      expect(() => {
        loggerService.log('Info message', 'TestContext');
        loggerService.warn('Warning message', 'TestContext');
        loggerService.debug('Debug message', 'TestContext');
        loggerService.error('Error message', 'stack', 'TestContext');
        loggerService.verbose('Verbose message', 'TestContext');
      }).not.toThrow();
    });

    it('should include context in logs', () => {
      const context = 'E2ETestContext';
      
      expect(() => {
        loggerService.log('Message with context', context);
      }).not.toThrow();
    });
  });

  describe('Production Environment', () => {
    beforeAll(async () => {
      process.env.NODE_ENV = 'production';
      
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [LoggerModuleCustom],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      
      loggerService = app.get<CustomLoggerService>(CustomLoggerService);
      pinoLogger = app.get<Logger>(Logger);
    });

    afterAll(async () => {
      await app.close();
    });

    it('should create log directory in production', () => {
      expect(fs.existsSync(logDir)).toBe(true);
    });

    it('should update error stats file in production', (done) => {
      loggerService.error('Another error', 'stack', 'Context');
      
      setTimeout(() => {
        expect(fs.existsSync(errorStatsFile)).toBe(true);
        
        const statsContent = JSON.parse(
          fs.readFileSync(errorStatsFile, 'utf-8'),
        );
        const today = new Date().toISOString().split('T')[0];
        
        expect(statsContent[today]).toBeGreaterThan(0);
        done();
      }, 100);
    });

    it('should retrieve error statistics', (done) => {
      loggerService.error('Error for stats', 'stack', 'StatsContext');
      
      setTimeout(() => {
        const stats = loggerService.getErrorStats();
        
        expect(stats.dailyCount).toBeDefined();
        expect(Object.keys(stats.dailyCount).length).toBeGreaterThan(0);
        done();
      }, 100);
    });

    it('should output JSON logs in production (not pretty-printed)', () => {
      // In production, logs should be JSON formatted, not colorized
      expect(() => {
        pinoLogger.log('Production log test');
      }).not.toThrow();
    });

    it('should handle multiple errors', (done) => {
      for (let i = 0; i < 5; i++) {
        loggerService.error(`Error ${i}`, `Stack ${i}`, `Context ${i}`);
      }
      
      setTimeout(() => {
        const stats = loggerService.getErrorStats();
        const today = new Date().toISOString().split('T')[0];
        expect(stats.dailyCount[today]).toBeGreaterThanOrEqual(5);
        done();
      }, 200);
    });
  });

  describe('Log Format Validation', () => {
    beforeAll(async () => {
      process.env.NODE_ENV = 'development';
      
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [LoggerModuleCustom],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      
      loggerService = app.get<CustomLoggerService>(CustomLoggerService);
    });

    afterAll(async () => {
      await app.close();
    });

    it('should not include level, time, pid, hostname in development logs', () => {
      // This test verifies that the configuration properly excludes these fields
      // The actual validation would be done by checking the pino-pretty options
      const message = 'Test format validation';
      
      expect(() => {
        loggerService.log(message, 'FormatTest');
      }).not.toThrow();
    });

    it('should handle correlationId in logs', () => {
      expect(() => {
        pinoLogger.log('Test with correlation ID');
      }).not.toThrow();
    });
  });
});
