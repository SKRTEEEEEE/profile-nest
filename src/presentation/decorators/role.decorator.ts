// src/infrastructure/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/domain/entities/role.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
