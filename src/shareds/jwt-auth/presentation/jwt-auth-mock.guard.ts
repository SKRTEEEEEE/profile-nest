import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PUBLIC_ROUTE_KEY } from './public-route.decorator';
import { UnauthorizedError } from 'src/domain/flows/domain.error';

@Injectable()
export class JwtAuthMockGuard extends AuthGuard('mock') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if the route is marked as public using the @PublicRoute() decorator
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // If not public, proceed with standard mock authentication
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Customize error handling
    if (err || !user) {
      throw err || new UnauthorizedError('Mock authentication failed');
    }
    return user;
  }
}