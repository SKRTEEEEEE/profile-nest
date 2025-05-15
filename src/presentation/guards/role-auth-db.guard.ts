import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { RoleType } from 'src/domain/entities/role.type';
import { RoleAuthService } from '../../application/usecases/shareds/role-auth.service';
import { RoleRepository } from 'src/application/interfaces/entities/role.interface';
import { MongooseBase } from 'src/infrastructure/mongoose/types';


// Not TESTED - Working/TODO
// Una versión con extra de seguridad en el que se comprueba que el token concuerde con el role en la bdd

// @Injectable()
// export class RoleAuthDbGuard implements CanActivate {
//   constructor(
//     private reflector: Reflector,
//     private roleAuthService: RoleAuthService,
//     private roleRepository: RoleRepository<MongooseBase> // o UserRepository, lo que uses
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles || requiredRoles.length === 0) return true;

//     const request = context.switchToHttp().getRequest();
//     const userId = request.user?.sub;
//     if (!userId) throw new ForbiddenException('No user ID found');

//     const user = await this.roleRepository.readById(userId);
//     const userRole: RoleType | null = user?.role ?? null;

//     return this.roleAuthService.checkAccess(userRole, requiredRoles);
//   }
// }
