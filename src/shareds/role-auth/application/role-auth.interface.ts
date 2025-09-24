import { RoleType } from 'src/domain/entities/role.type';

export abstract class RoleAuthInterface {
  abstract validateRoleAccess(options: {
    userRole: RoleType | null;
    requiredRoles: RoleType[] | undefined;
    isPublic: boolean;
    contextName?: string; // Para identificar el controller o ruta en consola si quieres
  }): boolean;
}
