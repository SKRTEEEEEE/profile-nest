import { Module } from '@nestjs/common';
import { SignatureAuthThirdwebGuard } from './signature-auth-thirdweb.guard';
import { AuthThirdWebRepo } from 'src/shareds/thirdweb/auth-thirdweb.repo';

@Module({
  providers: [SignatureAuthThirdwebGuard, AuthThirdWebRepo],
  exports: [SignatureAuthThirdwebGuard],
})
export class SignatureAuthModule {}