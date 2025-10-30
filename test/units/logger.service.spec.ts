import { Test, TestingModule } from '@nestjs/testing';
import { CustomLoggerService } from '../../src/shareds/presentation/logger.service';
import { PinoLogger } from 'nestjs-pino';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs module
jest.mock('fs');

describe('CustomLoggerService', () => {
  let service: CustomLoggerService;
  let mockPinoLogger: jest.Mocked<PinoLogger>;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(async () => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock PinoLogger
    mockPinoLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
      setContext: jest.fn(),
    } as any;

    // Mock fs functions
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.mkdirSync as jest.Mock).mockImplementation();
    (fs.readFileSync as jest.Mock).mockReturnValue('');
    (fs.writeFileSync as jest.Mock).mockImplementation();
    (fs.appendFileSync as jest.Mock).mockImplementation();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomLoggerService,
        {
          provide: PinoLogger,
          useValue: mockPinoLogger,
        },
      ],
    }).compile();

    service = module.get<CustomLoggerService>(CustomLoggerService);
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('Development Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should log info messages', () => {
      const message = 'Test info message';
      const context = 'TestContext';
      
      service.log(message, context);
      
      expect(mockPinoLogger.info).toHaveBeenCalledWith({ context }, message);
    });

    it('should log error messages', () => {
      const message = 'Test error message';
      const stack = 'Error stack trace';
      const context = 'TestContext';
      
      service.error(message, stack, context);
      
      expect(mockPinoLogger.error).toHaveBeenCalledWith(
        { context, stack },
        message,
      );
    });

    it('should log warning messages', () => {
      const message = 'Test warning message';
      const context = 'TestContext';
      
      service.warn(message, context);
      
      expect(mockPinoLogger.warn).toHaveBeenCalledWith({ context }, message);
    });

    it('should log debug messages', () => {
      const message = 'Test debug message';
      const context = 'TestContext';
      
      service.debug(message, context);
      
      expect(mockPinoLogger.debug).toHaveBeenCalledWith({ context }, message);
    });

    it('should log verbose messages', () => {
      const message = 'Test verbose message';
      const context = 'TestContext';
      
      service.verbose(message, context);
      
      expect(mockPinoLogger.trace).toHaveBeenCalledWith({ context }, message);
    });

    it('should handle object messages', () => {
      const messageObj = { message: 'Object message' };
      const context = 'TestContext';
      
      service.log(messageObj, context);
      
      expect(mockPinoLogger.info).toHaveBeenCalledWith(
        { context },
        'Object message',
      );
    });

    it('should not save error logs in development', () => {
      service.error('Test error', 'stack', 'TestContext');
      
      expect(fs.appendFileSync).not.toHaveBeenCalled();
    });
  });

  describe('Production Environment', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      // Re-create service for production environment
      jest.clearAllMocks();
    });

    it('should create log directory in production if not exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      // Create new instance to trigger constructor
      new CustomLoggerService(mockPinoLogger);
      
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('logs'),
        { recursive: true },
      );
    });

    it('should update error stats in production', () => {
      const newService = new CustomLoggerService(mockPinoLogger);
      const message = 'Production error';
      const stack = 'Error stack';
      const context = 'ProdContext';
      
      newService.error(message, stack, context);
      
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should increment error count when saving errors', () => {
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('{}');
      
      const newService = new CustomLoggerService(mockPinoLogger);
      newService.error('Error message', 'stack', 'Context');
      
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should handle errors in updateErrorStats gracefully', () => {
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File system error');
      });
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const newService = new CustomLoggerService(mockPinoLogger);
      
      expect(() => {
        newService.error('Test error', 'stack', 'Context');
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Error Statistics', () => {
    it('should return empty stats in development', () => {
      process.env.NODE_ENV = 'development';
      const service = new CustomLoggerService(mockPinoLogger);
      
      const stats = service.getErrorStats();
      
      expect(stats).toEqual({ dailyCount: {} });
    });

    it('should return stats in production when files exist', () => {
      process.env.NODE_ENV = 'production';
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockReturnValue('{"2025-10-26": 5}');
      
      const service = new CustomLoggerService(mockPinoLogger);
      const stats = service.getErrorStats();
      
      expect(stats.dailyCount).toEqual({ '2025-10-26': 5 });
    });

    it('should handle missing files gracefully', () => {
      process.env.NODE_ENV = 'production';
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const service = new CustomLoggerService(mockPinoLogger);
      const stats = service.getErrorStats();
      
      expect(stats).toEqual({ dailyCount: {} });
    });
  });

  describe('Stats Cleanup', () => {
    it('should clean old error stats on startup in production', () => {
      process.env.NODE_ENV = 'production';
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      
      const twoMonthsAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;
      const errorStats = {
        [twoMonthsAgo.toString()]: 10,
        [Date.now().toString()]: 5,
      };
      
      (fs.readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(errorStats),
      );
      
      new CustomLoggerService(mockPinoLogger);
      
      expect(fs.writeFileSync).toHaveBeenCalled();
    });

    it('should handle cleanup errors gracefully', () => {
      process.env.NODE_ENV = 'production';
      (fs.existsSync as jest.Mock).mockReturnValue(true);
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Read error');
      });
      
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => {
        new CustomLoggerService(mockPinoLogger);
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});
