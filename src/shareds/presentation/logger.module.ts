// src/shareds/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { multistream } from 'pino-multi-stream';
import { createStream } from 'rotating-file-stream';
import * as path from 'path';

import { CORRELATION_ID_HEADER } from './correlation-id.middleware';
import { CustomLoggerService } from './logger.service';

// Detecta ambiente de desarrollo: NODE_ENV=development, JWT_STRATEGY=mock, o cualquier comando start:dev*
const isDev =
  process.env.NODE_ENV === 'development' || 
  process.env.JWT_STRATEGY === 'mock' ||
  process.env.JWT_STRATEGY === 'd' ||
  !process.env.NODE_ENV; // Si NODE_ENV no está definido, asume desarrollo

const isProduction = process.env.NODE_ENV === 'production';

// Helper para obtener emojis según contexto
function getContextEmoji(context: string): string {
  const emojiMap: Record<string, string> = {
    'NestFactory': '🏭',
    'InstanceLoader': '📦',
    'RoutesResolver': '🛣️',
    'RouterExplorer': '🗺️',
    'NestApplication': '🚀',
    'ResponseInterceptor': '🔄',
    'DomainErrorFilter': '❌',
    'MongooseModule': '🍃',
    'ConfigService': '⚙️',
    'AuthGuard': '🔐',
    'ValidationPipe': '✅',
  };
  
  return emojiMap[context] || '📌';
}

// Configure log rotation for production
const getProductionStream = () => {
  const logDir = path.join(process.cwd(), 'docs/logs');
  
  // Create rotating stream for general logs
  const generalStream = createStream('application.log', {
    interval: '1d', // Rotate daily
    maxFiles: 7, // Keep 7 days
    path: logDir,
    compress: 'gzip', // Compress old files
  });

  // Create rotating stream for error logs
  const errorStream = createStream('error.log', {
    interval: '1d', // Rotate daily
    maxFiles: 30, // Keep 30 days for errors
    path: logDir,
    compress: 'gzip',
  });

  return multistream([
    { stream: generalStream, level: 'info' },
    { stream: errorStream, level: 'error' },
  ]);
};

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
        messageKey: 'message',
        level: isDev ? 'debug' : 'info',
        
        // Remove timestamp, level, pid, hostname from logs
        timestamp: false,
        base: null, // This removes pid and hostname
        
        customProps: (req: any) => ({
          correlationId: req[CORRELATION_ID_HEADER],
        }),
        customSuccessMessage: (req: any, res: any) => {
          const status = res.statusCode;
          const emoji = status >= 300 ? '↪️' : '✅';
          // El responseTime se agrega automáticamente por pino-http
          return `${emoji} ${req.method} ${req.url} → ${status}`;
        },
        customErrorMessage: (req: any, res: any, err: any) => {
          const status = res.statusCode;
          const emoji = status >= 500 ? '❌' : '⚠️';
          return `${emoji} ${req.method} ${req.url} → ${status} [${err.message}]`;
        },
        customLogLevel: (req: any, res: any, err: any) => {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          } else if (res.statusCode >= 500 || err) {
            return 'error';
          } else if (res.statusCode >= 300 && res.statusCode < 400) {
            return 'info';
          }
          return 'info';
        },
        serializers: {
          req: (req: any) => ({
            method: req.method,
            url: req.url,
            correlationId: req[CORRELATION_ID_HEADER],
            userAgent: req.headers['user-agent'],
          }),
          res: (res: any) => ({
            statusCode: res.statusCode,
          }),
          err: (err: any) => ({
            type: err.type,
            message: err.message,
            stack: err.stack,
          }),
        },

        // Development: Pretty printed logs with colors
        transport: isDev
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: false,
                ignore: 'pid,hostname,time,level,v',
                messageKey: 'message',
                singleLine: false,
                // Formato simple que no requiere serialización
                messageFormat: '{context} - {msg}',
              },
            }
          : undefined,
        
        // Production: Use rotating file streams
        stream: isProduction ? getProductionStream() : undefined,
      },
    }),
  ],
  providers: [CustomLoggerService],
  exports: [PinoLoggerModule, CustomLoggerService],
})
export class LoggerModuleCustom {}
