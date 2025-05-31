import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthThirdWebRepo } from 'src/shareds/thirdweb/auth-thirdweb.repo';
import { Reflector } from '@nestjs/core';
import { UnauthorizedError } from 'src/domain/flows/domain.error';

@Injectable()
export class SignatureAuthThirdWebGuard implements CanActivate {
  constructor(
    private readonly authThirdWebRepository: AuthThirdWebRepo,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (process.env.JWT_STRATEGY === 'mock') {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // Leer el payload firmado desde el header
    const signedPayload = request.headers['x-signed-payload'];
    if (!signedPayload) {
      throw new UnauthorizedError(SignatureAuthThirdWebGuard,'Missing signed payload header');
    }

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(signedPayload);
    } catch {
      throw new UnauthorizedError(SignatureAuthThirdWebGuard,'Invalid signed payload format');
    }

    const verified = await this.authThirdWebRepository.verifyPayload(parsedPayload);
    if (!verified.valid) {
      throw new UnauthorizedError(SignatureAuthThirdWebGuard,'Invalid signature payload');
    }

    request.verifiedPayload = verified;
    return true;
  }
}