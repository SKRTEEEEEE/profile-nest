import { Module } from '@nestjs/common';
import { SignatureAuthThirdWebGuard } from './signature-auth-thirdweb.guard';
import { AuthThirdWebRepo } from 'src/shareds/thirdweb/auth-thirdweb.repo';

@Module({
  providers: [SignatureAuthThirdWebGuard, AuthThirdWebRepo],
  exports: [SignatureAuthThirdWebGuard],
})
export class SignatureAuthModule {}
