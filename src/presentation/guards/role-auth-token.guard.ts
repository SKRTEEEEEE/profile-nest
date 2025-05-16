// src/infrastructure/guards/role-from-token.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from 'src/domain/entities/role.type';
import { ROLES_KEY } from '../decorators/role.decorator';
import {  RoleAuthService } from '../../application/usecases/shareds/role-auth.service';
import { PUBLIC_ROUTE_KEY } from '../decorators/public-route.decorator';


//DO - manejar los casos (warning) en el que se use el decorador de roles y no se pasa el Role -> se comportara como si no se le pasara el decorador de roles ✅
//DO - manejar los casos (warning) en el que se use el decorador de roles y el de PublicRoute a la vez -> se comportara como si no se le pasara el de PublicRoute ✅
//DO - manejar los casos (warning) en el que se use el decorador de roles y se le pase varios roles -> se comportara utilizando el de mayor rango ⚠️🚧 -- ToTEST
@Injectable()
export class RoleAuthTokenGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly roleAuthService: RoleAuthService
  ){}
  canActivate(context: ExecutionContext): boolean  {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? false;

    const request = context.switchToHttp().getRequest();
    const userRole: RoleType | null = request.user?.ctx?.role;


    return this.roleAuthService.validateRoleAccess({
      userRole, 
      requiredRoles,
      isPublic,
      contextName: context.getClass().name + "." + context.getHandler().name
    })
  }
}
// @Injectable()
// export class RoleAuthTokenGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private readonly roleAuthService: RoleAuthService
//   ) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     // if (!requiredRoles || requiredRoles.length === 0) {      
//     //   console.warn("No roles defined in Role decorator")
//     //   return true
//     // }

//     const request = context.switchToHttp().getRequest();
//     const userRole = request.user?.ctx.role ?? null;

//     if (!userRole) throw new ForbiddenException('Insufficient role privileges');

//     return this.roleAuthService.checkAccess(userRole, requiredRoles)
//   }
// }