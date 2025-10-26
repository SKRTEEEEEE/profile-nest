// src/shareds/presentation/logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger, PinoLogger } from 'nestjs-pino';
import * as fs from 'fs';
import * as path from 'path';

export interface LogEntry {
  timestamp: number;
  level: string;
  message: string;
  context?: string;
  correlationId?: string;
  stack?: string;
}

@Injectable()
export class CustomLoggerService implements NestLoggerService {
  private readonly logDir = path.join(process.cwd(), 'logs');
  private readonly errorLogFile = path.join(this.logDir, 'errors.log');
  private readonly errorCountFile = path.join(this.logDir, 'error-count.json');
  private readonly isProduction = process.env.NODE_ENV === 'production';

  constructor(private readonly logger: PinoLogger) {
    if (this.isProduction) {
      this.ensureLogDirectory();
      this.cleanOldErrorLogs();
    }
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private cleanOldErrorLogs() {
    try {
      // Clean error logs older than 3 days
      const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;

      if (fs.existsSync(this.errorLogFile)) {
        const content = fs.readFileSync(this.errorLogFile, 'utf-8');
        const logs = content
          .split('\n')
          .filter((line) => line.trim())
          .map((line) => {
            try {
              return JSON.parse(line);
            } catch {
              return null;
            }
          })
          .filter((log) => log && log.timestamp > threeDaysAgo);

        fs.writeFileSync(
          this.errorLogFile,
          logs.map((log) => JSON.stringify(log)).join('\n'),
        );
      }

      // Clean error count older than 1 month
      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      if (fs.existsSync(this.errorCountFile)) {
        const counts = JSON.parse(
          fs.readFileSync(this.errorCountFile, 'utf-8'),
        );
        const filteredCounts = Object.entries(counts)
          .filter(([timestamp]) => parseInt(timestamp) > oneMonthAgo)
          .reduce(
            (acc, [key, value]) => {
              acc[key] = value as number;
              return acc;
            },
            {} as Record<string, number>,
          );
        fs.writeFileSync(
          this.errorCountFile,
          JSON.stringify(filteredCounts, null, 2),
        );
      }
    } catch (error) {
      // Silently fail if cleanup fails
      console.error('Error cleaning old logs:', error);
    }
  }

  private saveErrorLog(entry: LogEntry) {
    if (!this.isProduction) return;

    try {
      // Save error to file
      fs.appendFileSync(this.errorLogFile, JSON.stringify(entry) + '\n');

      // Update error count
      const dateKey = new Date(entry.timestamp).toISOString().split('T')[0];
      let counts: Record<string, number> = {};

      if (fs.existsSync(this.errorCountFile)) {
        counts = JSON.parse(fs.readFileSync(this.errorCountFile, 'utf-8'));
      }

      counts[dateKey] = (counts[dateKey] || 0) + 1;
      fs.writeFileSync(this.errorCountFile, JSON.stringify(counts, null, 2));
    } catch (error) {
      // Silently fail if save fails
      console.error('Error saving error log:', error);
    }
  }

  log(message: any, context?: string) {
    const logMessage = typeof message === 'string' ? message : message.message;
    this.logger.info({ context }, logMessage);
  }

  error(message: any, stack?: string, context?: string) {
    const errorMessage = typeof message === 'string' ? message : message.message;
    this.logger.error({ context, stack }, errorMessage);

    // Save error to file in production
    const entry: LogEntry = {
      timestamp: Date.now(),
      level: 'error',
      message: errorMessage,
      context,
      stack,
    };
    this.saveErrorLog(entry);
  }

  warn(message: any, context?: string) {
    const warnMessage = typeof message === 'string' ? message : message.message;
    this.logger.warn({ context }, warnMessage);
  }

  debug(message: any, context?: string) {
    const debugMessage =
      typeof message === 'string' ? message : message.message;
    this.logger.debug({ context }, debugMessage);
  }

  verbose(message: any, context?: string) {
    const verboseMessage =
      typeof message === 'string' ? message : message.message;
    this.logger.trace({ context }, verboseMessage);
  }

  getErrorStats(): { dailyCount: Record<string, number>; recentErrors: LogEntry[] } {
    if (!this.isProduction || !fs.existsSync(this.errorCountFile)) {
      return { dailyCount: {}, recentErrors: [] };
    }

    try {
      const dailyCount = JSON.parse(
        fs.readFileSync(this.errorCountFile, 'utf-8'),
      );
      const recentErrors = fs.existsSync(this.errorLogFile)
        ? fs
            .readFileSync(this.errorLogFile, 'utf-8')
            .split('\n')
            .filter((line) => line.trim())
            .map((line) => JSON.parse(line))
            .slice(-100) // Last 100 errors
        : [];

      return { dailyCount, recentErrors };
    } catch {
      return { dailyCount: {}, recentErrors: [] };
    }
  }
}
