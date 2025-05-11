import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MockAuthUserGuard } from '../guards/mock-auth-user.guard';
import { MockAuthUserStrategy } from 'src/infrastructure/adapters/mock-auth-user.strategy';


@Module({
  imports: [PassportModule],
  providers: [MockAuthUserGuard, MockAuthUserStrategy],
})
export class MockAuthUserModule {}
