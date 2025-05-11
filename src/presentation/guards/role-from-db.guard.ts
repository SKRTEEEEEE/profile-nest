import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { RoleService } from 'src/application/usecases/entities/role.service';
import { MongooseBase } from 'src/infrastructure/mongoose/types';
import { RoleType } from 'src/domain/entities/role.type';

@Injectable()
export class RoleFromDbGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly roleService: RoleService<MongooseBase>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    const role = await this.roleService.readById(user.id);
    return requiredRoles.includes(role?.permissions as RoleType);
  }
}
