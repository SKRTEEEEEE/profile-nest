import { Module } from '@nestjs/common';
import { SignatureAuthThirdwebGuard } from './signature-auth-thirdweb.guard';
import { AuthThirdwebRepo } from 'src/shareds/thirdweb/auth-thirdweb.repo';

@Module({
  providers: [SignatureAuthThirdwebGuard, AuthThirdwebRepo],
  exports: [SignatureAuthThirdwebGuard],
})
export class SignatureAuthModule {}