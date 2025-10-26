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
  private readonly errorStatsFile = path.join(this.logDir, 'error-stats.json');
  private readonly isProduction = process.env.NODE_ENV === 'production';

  constructor(private readonly logger: PinoLogger) {
    if (this.isProduction) {
      this.ensureLogDirectory();
      this.cleanOldErrorStats();
    }
  }

  private ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private cleanOldErrorStats() {
    try {
      // Clean error stats older than 1 month
      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      if (fs.existsSync(this.errorStatsFile)) {
        const stats = JSON.parse(
          fs.readFileSync(this.errorStatsFile, 'utf-8'),
        );
        const filteredStats = Object.entries(stats)
          .filter(([timestamp]) => parseInt(timestamp) > oneMonthAgo)
          .reduce(
            (acc, [key, value]) => {
              acc[key] = value as number;
              return acc;
            },
            {} as Record<string, number>,
          );
        fs.writeFileSync(
          this.errorStatsFile,
          JSON.stringify(filteredStats, null, 2),
        );
      }
    } catch (error) {
      // Silently fail if cleanup fails
      console.error('Error cleaning old stats:', error);
    }
  }

  private updateErrorStats() {
    if (!this.isProduction) return;

    try {
      const dateKey = new Date().toISOString().split('T')[0];
      let stats: Record<string, number> = {};

      if (fs.existsSync(this.errorStatsFile)) {
        stats = JSON.parse(fs.readFileSync(this.errorStatsFile, 'utf-8'));
      }

      stats[dateKey] = (stats[dateKey] || 0) + 1;
      fs.writeFileSync(this.errorStatsFile, JSON.stringify(stats, null, 2));
    } catch (error) {
      // Silently fail if save fails
      console.error('Error updating error stats:', error);
    }
  }

  log(message: any, context?: string) {
    const logMessage = typeof message === 'string' ? message : message.message;
    this.logger.info({ context }, logMessage);
  }

  error(message: any, stack?: string, context?: string) {
    const errorMessage = typeof message === 'string' ? message : message.message;
    this.logger.error({ context, stack }, errorMessage);

    // Update error statistics in production
    this.updateErrorStats();
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

  getErrorStats(): { dailyCount: Record<string, number> } {
    if (!this.isProduction || !fs.existsSync(this.errorStatsFile)) {
      return { dailyCount: {} };
    }

    try {
      const dailyCount = JSON.parse(
        fs.readFileSync(this.errorStatsFile, 'utf-8'),
      );
      return { dailyCount };
    } catch {
      return { dailyCount: {} };
    }
  }
}
