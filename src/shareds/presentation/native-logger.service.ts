// src/shareds/presentation/native-logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class NativeLoggerService implements LoggerService {
  private correlationId?: string;
  private readonly isProduction = process.env.NODE_ENV === 'production';
  private readonly isDevelopment = 
    process.env.NODE_ENV === 'development' || 
    process.env.JWT_STRATEGY === 'mock' ||
    process.env.JWT_STRATEGY === 'd' ||
    !process.env.NODE_ENV;

  // ANSI color codes for development
  private readonly colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    // Foreground colors
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    // Background colors
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
  };

  setCorrelationId(correlationId: string) {
    this.correlationId = correlationId;
  }

  private formatMessage(
    level: string,
    message: any,
    context?: string,
    stack?: string,
  ): string | object {
    const timestamp = new Date().toISOString();
    
    // Extract message string
    let messageStr: string;
    let additionalData: any = {};

    if (typeof message === 'string') {
      messageStr = message;
    } else if (message instanceof Error) {
      messageStr = message.message;
      stack = stack || message.stack;
      additionalData = {
        name: message.name,
        ...Object.getOwnPropertyNames(message).reduce((acc, key) => {
          if (!['message', 'stack', 'name'].includes(key)) {
            acc[key] = (message as any)[key];
          }
          return acc;
        }, {} as any),
      };
    } else if (message?.message) {
      messageStr = message.message;
      additionalData = { ...message };
      delete additionalData.message;
    } else {
      try {
        messageStr = JSON.stringify(message);
      } catch (error) {
        // Handle circular references
        messageStr = '[Circular or Complex Object]';
        additionalData = { error: 'Could not stringify message' };
      }
    }

    if (this.isProduction) {
      // Production: JSON format for structured logging
      const logObject: any = {
        level,
        timestamp,
        message: messageStr,
        ...(context && { context }),
        ...(this.correlationId && { correlationId: this.correlationId }),
        ...(stack && { stack }),
        ...(Object.keys(additionalData).length > 0 && { details: additionalData }),
      };

      return JSON.stringify(logObject);
    } else {
      // Development: Human-readable format with colors
      const timeStr = new Date().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      let levelColor = this.colors.white;
      let emoji = '📝';

      switch (level) {
        case 'log':
          levelColor = this.colors.green;
          emoji = '✅';
          break;
        case 'error':
          levelColor = this.colors.red;
          emoji = '❌';
          break;
        case 'warn':
          levelColor = this.colors.yellow;
          emoji = '⚠️';
          break;
        case 'debug':
          levelColor = this.colors.blue;
          emoji = '🔍';
          break;
        case 'verbose':
          levelColor = this.colors.cyan;
          emoji = '💬';
          break;
      }

      // Format: [TIME] EMOJI [CONTEXT] MESSAGE
      let output = `${this.colors.dim}${timeStr}${this.colors.reset} ${emoji}`;
      
      if (context) {
        output += ` ${levelColor}[${context}]${this.colors.reset}`;
      }
      
      output += ` ${messageStr}`;

      if (this.correlationId) {
        output += `${this.colors.dim} (ID: ${this.correlationId.substring(0, 8)}...)${this.colors.reset}`;
      }

      if (stack && level === 'error') {
        output += `\n${this.colors.red}${stack}${this.colors.reset}`;
      }

      if (Object.keys(additionalData).length > 0 && Object.keys(additionalData).length < 5) {
        const details = Object.entries(additionalData)
          .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
          .join(', ');
        output += `${this.colors.dim}\n   ℹ️  ${details}${this.colors.reset}`;
      }

      return output;
    }
  }

  log(message: any, context?: string) {
    const formatted = this.formatMessage('log', message, context);
    if (this.isProduction) {
      console.log(formatted);
    } else {
      console.log(formatted);
    }
  }

  error(message: any, stack?: string, context?: string) {
    const formatted = this.formatMessage('error', message, context, stack);
    if (this.isProduction) {
      console.error(formatted);
    } else {
      console.error(formatted);
    }
  }

  warn(message: any, context?: string) {
    const formatted = this.formatMessage('warn', message, context);
    if (this.isProduction) {
      console.warn(formatted);
    } else {
      console.warn(formatted);
    }
  }

  debug(message: any, context?: string) {
    // Only log debug in development or if explicitly enabled
    if (!this.isDevelopment && process.env.LOG_LEVEL !== 'debug') {
      return;
    }

    const formatted = this.formatMessage('debug', message, context);
    console.debug(formatted);
  }

  verbose(message: any, context?: string) {
    // Only log verbose in development or if explicitly enabled
    if (!this.isDevelopment && process.env.LOG_LEVEL !== 'verbose') {
      return;
    }

    const formatted = this.formatMessage('verbose', message, context);
    console.debug(formatted);
  }
}
