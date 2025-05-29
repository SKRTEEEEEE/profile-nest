import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthThirdwebRepo } from 'src/shareds/thirdweb/auth-thirdweb.repo';
import { Reflector } from '@nestjs/core';
import { UnauthorizedError } from 'src/domain/flows/domain.error';

@Injectable()
export class SignatureAuthThirdwebGuard implements CanActivate {
  constructor(
    private readonly authThirdWebRepository: AuthThirdwebRepo,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Leer el payload firmado desde el header
    const signedPayload = request.headers['x-signed-payload'];
    if (!signedPayload) {
      throw new UnauthorizedException('Missing signed payload header');
    }

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(signedPayload);
    } catch {
      throw new UnauthorizedError('Invalid signed payload format');
    }

    const verified = await this.authThirdWebRepository.verifyPayload(parsedPayload);
    if (!verified.valid) {
      throw new UnauthorizedError('Invalid signature payload');
    }

    request.verifiedPayload = verified.payload;
    return true;
  }
}