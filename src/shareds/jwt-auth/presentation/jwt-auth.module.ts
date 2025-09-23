import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthMockGuard } from './jwt-auth-mock.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthThirdwebGuard } from './jwt-auth-thirdweb.guard';
import { Reflector } from '@nestjs/core';
import { JwtAuthThirdwebRepo } from 'src/shareds/jwt-auth/infrastructure/jwt-auth-thirdweb.repo';
import { JwtAuthUseCase } from 'src/shareds/jwt-auth/application/jwt-auth.usecase';
import { JwtAuthInterface } from 'src/shareds/jwt-auth/application/jwt-auth.interface';
import { JwtAuthMockStrategy } from './jwt-auth-mock.strategy';
import { JwtAuthThirdwebStrategy } from './jwt-auth-thirdweb.strategy';
import { ThirdWebModule } from 'src/shareds/thirdweb/thirdweb.module';

@Module({
  imports: [PassportModule],
  providers: [JwtAuthMockGuard, JwtAuthMockStrategy],
})
export class JwtAuthMockModule {}
@Module({
  imports: [ConfigModule, ThirdWebModule],
  providers: [
    JwtAuthThirdwebStrategy,
    JwtAuthThirdwebGuard,
    JwtAuthThirdwebRepo,
    {
      provide: JwtAuthInterface,
      useExisting: JwtAuthThirdwebRepo,
    },
    JwtAuthUseCase,
    Reflector,
  ],
})
export class JwtAuthThirdWebModule {}
