// src/shareds/presentation/native-logger.module.ts
import { Global, Module } from '@nestjs/common';
import { NativeLoggerService } from './native-logger.service';

/**
 * Global module for NativeLoggerService
 * 
 * This module is marked as @Global() which means NativeLoggerService
 * will be available for dependency injection in all modules without
 * needing to explicitly import NativeLoggerModule.
 * 
 * This solves the Railway deployment issue where NativeLoggerService
 * couldn't be injected into use cases in child modules.
 */
@Global()
@Module({
  providers: [NativeLoggerService],
  exports: [NativeLoggerService],
})
export class NativeLoggerModule {}
