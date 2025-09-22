// src/shareds/logger/logger.module.ts
import { Module, Global } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import { CORRELATION_ID_HEADER } from './correlation-id.middleware';

const isDev = process.env.NODE_ENV === 'development' || process.env.JWT_STRATEGY === 'mock';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        messageKey: 'message',
        customProps: (req: any) => ({
          correlationId: req[CORRELATION_ID_HEADER],
        }),
        serializers: {
          req: () => undefined,
          res: () => undefined,
        },
        
        transport: isDev ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
            messageKey: "message"
          },
        } : undefined,
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModuleCustom {}
