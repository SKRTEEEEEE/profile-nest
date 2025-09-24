// src/infrastructure/guards/role-from-token.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from 'src/domain/entities/role.type';
import { ROLES_KEY } from './role.decorator';
import { PUBLIC_ROUTE_KEY } from '../../jwt-auth/presentation/public-route.decorator';
import { RoleAuthUseCase } from '../application/role-auth.usecase';

//DO - manejar los casos (warning) en el que se use el decorador de roles y no se pasa el Role -> se comportara como si no se le pasara el decorador de roles ✅
//DO - manejar los casos (warning) en el que se use el decorador de roles y el de PublicRoute a la vez -> se comportara como si no se le pasara el de PublicRoute ✅
//DO - manejar los casos (warning) en el que se use el decorador de roles y se le pase varios roles -> se comportara utilizando el de mayor rango ⚠️🚧 -- ToTEST
@Injectable()
export class RoleAuthTokenGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly roleAuthService: RoleAuthUseCase,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isPublic =
      this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? false;

    const request = context.switchToHttp().getRequest();
    const userRole: RoleType | null = request.user?.ctx?.role;

    return this.roleAuthService.validateRoleAccess({
      userRole,
      requiredRoles,
      isPublic,
      contextName: context.getClass().name + '.' + context.getHandler().name,
    });
  }
}
