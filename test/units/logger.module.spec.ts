import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModuleCustom } from '../../src/shareds/presentation/logger.module';
import { Logger } from 'nestjs-pino';
import { INestApplication } from '@nestjs/common';

describe('LoggerModuleCustom', () => {
  let app: INestApplication;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [LoggerModuleCustom],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    logger = app.get(Logger);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should have log method', () => {
    expect(logger.log).toBeDefined();
    expect(typeof logger.log).toBe('function');
  });

  it('should have error method', () => {
    expect(logger.error).toBeDefined();
    expect(typeof logger.error).toBe('function');
  });

  it('should have warn method', () => {
    expect(logger.warn).toBeDefined();
    expect(typeof logger.warn).toBe('function');
  });

  it('should have debug method', () => {
    expect(logger.debug).toBeDefined();
    expect(typeof logger.debug).toBe('function');
  });

  it('should log messages without throwing', () => {
    expect(() => logger.log('Test log message')).not.toThrow();
  });

  it('should log errors without throwing', () => {
    expect(() => logger.error('Test error message')).not.toThrow();
  });

  it('should log warnings without throwing', () => {
    expect(() => logger.warn('Test warning message')).not.toThrow();
  });

  it('should log debug messages without throwing', () => {
    expect(() => logger.debug('Test debug message')).not.toThrow();
  });

  it('should log with context', () => {
    expect(() => logger.log('Test with context', 'TestContext')).not.toThrow();
  });

  it('should log errors with context and stack', () => {
    const error = new Error('Test error');
    expect(() =>
      logger.error('Error occurred', error.stack, 'TestContext'),
    ).not.toThrow();
  });
});
