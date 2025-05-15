import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { UserAuthJWTPayload } from 'src/application/interfaces/shareds/user-auth.interface';
import { UserAuthService } from 'src/application/usecases/shareds/user-auth.service';

@Injectable()
export class UserAuthThirdwebStrategy extends PassportStrategy(Strategy, 'thirdweb') {
  constructor(
    private readonly userAuthService: UserAuthService
  ){super()}
  async validate(req: Request): Promise<UserAuthJWTPayload> {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.userAuthService.verifyJWT(token)
      return payload?.parsedJWT as UserAuthJWTPayload;
    } catch (err) {
      console.error('Thirdweb JWT verification failed', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
