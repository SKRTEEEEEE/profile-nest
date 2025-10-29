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
        autoLogging: {
          ignore: (req: any) => {
            // Don't log health checks or other noise
            return req.url?.includes('/health') || req.url?.includes('/metrics');
          }
        },
        messageKey: 'message',
        level: isDev ? 'debug' : 'info',
        
        // Timestamp configuration
        // Development: formatted for pino-pretty
        // Production: standard pino timestamp for structured JSON logs
        timestamp: isDev ? () => `,"time":"${new Date().toISOString()}"` : true,
        base: null, // This removes pid and hostname
        
        customProps: (req: any) => ({
          correlationId: req[CORRELATION_ID_HEADER],
        }),
        customSuccessMessage: (req: any, res: any) => {
          const status = res.statusCode;
          const emoji = status >= 300 ? '↪️' : '✅';
          const method = req.method.padEnd(6);
          const responseTime = res.responseTime || res.getHeader?.('X-Response-Time');
          const time = responseTime ? ` +${Math.round(responseTime)}ms` : '';
          return `${emoji} ${method} ${req.url} → ${status}${time}`;
        },
        customErrorMessage: (req: any, res: any, err: any) => {
          const status = res.statusCode;
          const emoji = status >= 500 ? '❌' : '⚠️';
          const method = req.method.padEnd(6);
          const responseTime = res.responseTime || res.getHeader?.('X-Response-Time');
          const time = responseTime ? ` +${Math.round(responseTime)}ms` : '';
          const errMsg = err?.message ? ` - ${err.message}` : '';
          return `${emoji} ${method} ${req.url} → ${status}${time}${errMsg}`;
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
          req: (req: any) => {
            // Production: Include more details for structured logging
            if (isProduction) {
              return {
                id: req.id,
                method: req.method,
                url: req.url,
                query: req.query,
                params: req.params,
                headers: {
                  host: req.headers?.host,
                  'user-agent': req.headers?.['user-agent'],
                  'content-type': req.headers?.['content-type'],
                },
                remoteAddress: req.ip || req.connection?.remoteAddress,
                correlationId: req[CORRELATION_ID_HEADER],
              };
            }
            // Development: Keep it simple for readability
            return {
              method: req.method,
              url: req.url,
            };
          },
          res: (res: any) => {
            if (isProduction) {
              return {
                statusCode: res.statusCode,
                headers: {
                  'content-type': res.getHeader?.('content-type'),
                  'content-length': res.getHeader?.('content-length'),
                },
              };
            }
            return {
              statusCode: res.statusCode,
            };
          },
          err: (err: any) => ({
            type: err.type,
            message: err.message,
            stack: err.stack, // Always include stack trace in logs (file or console)
            ...(err.code && { code: err.code }),
            ...(err.errno && { errno: err.errno }),
          }),
        },

        // Development: Pretty printed logs with colors (compact format)
        transport: isDev
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss',
                ignore: 'pid,hostname',
                singleLine: true,
                messageFormat: '{if context}[{context}]{end} {msg}',
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
