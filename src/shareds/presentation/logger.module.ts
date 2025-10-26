// src/shareds/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { CORRELATION_ID_HEADER } from './correlation-id.middleware';
import { CustomLoggerService } from './logger.service';

const isDev =
  process.env.NODE_ENV === 'development' || process.env.JWT_STRATEGY === 'mock';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
        messageKey: 'message',
        level: isDev ? 'debug' : 'info',
        customProps: (req: any) => ({
          correlationId: req[CORRELATION_ID_HEADER],
        }),
        customSuccessMessage: (req: any, res: any) => {
          return `${req.method} ${req.url} completed with status ${res.statusCode}`;
        },
        customErrorMessage: (req: any, res: any, err: any) => {
          return `${req.method} ${req.url} failed with status ${res.statusCode}: ${err.message}`;
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

        transport: isDev
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss',
                ignore: 'pid,hostname',
                messageKey: 'message',
                singleLine: false,
                levelFirst: true,
                messageFormat: '{levelLabel} - {context} - {msg}',
              },
            }
          : undefined,
      },
    }),
  ],
  providers: [CustomLoggerService],
  exports: [PinoLoggerModule, CustomLoggerService],
})
export class LoggerModuleCustom {}
