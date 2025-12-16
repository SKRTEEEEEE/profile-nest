import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { JwtAuthPayload } from 'src/shareds/jwt-auth/application/jwt-auth.interface';
import { JwtAuthUseCase } from 'src/shareds/jwt-auth/application/jwt-auth.usecase';
import { createDomainError } from '@skrteeeeee/profile-domain/dist/flows/error.registry';
import { ErrorCodes } from '@skrteeeeee/profile-domain/dist/flows/error.type';

@Injectable()
export class JwtAuthThirdwebStrategy extends PassportStrategy(
  Strategy,
  'thirdweb',
) {
  constructor(private readonly userAuthService: JwtAuthUseCase) {
    super();
  }
  async validate(req: Request): Promise<JwtAuthPayload> {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw createDomainError(
        ErrorCodes.UNAUTHORIZED_ACTION,
        JwtAuthThirdwebStrategy,
        'validate',
        undefined,
        { shortDesc: 'No token provided' },
      );
    }

    try {
      const payload = await this.userAuthService.verifyJWT(token);
      return payload?.parsedJWT as JwtAuthPayload;
    } catch (err) {
      console.error('Thirdweb JWT verification failed', err);
      throw createDomainError(
        ErrorCodes.UNAUTHORIZED_ACTION,
        JwtAuthThirdwebStrategy,
        'validate',
        'credentials',
        { shortDesc: 'Invalid token' },
      );
    }
  }
}
