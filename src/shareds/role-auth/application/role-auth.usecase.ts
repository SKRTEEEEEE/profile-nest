// role-authorization.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { RoleAuthInterface } from 'src/shareds/role-auth/application/role-auth.interface';
import { RoleHierarchy, RoleType } from 'src/domain/entities/role.type';

@Injectable()
export class RoleAuthUseCase implements RoleAuthInterface {
  // 🧠✅ Ahora no tiene sentido tener roleAuthRepository como constructor, porque no se va a crear realmente
  // constructor(
  //   private readonly roleAuthRepository: RoleAuthInterface
  // ){}
  validateRoleAccess(options: {
    userRole: RoleType | null;
    requiredRoles: RoleType[] | undefined;
    isPublic: boolean;
    contextName?: string; // Para identificar el controller o ruta en consola si quieres
  }): boolean {
    const { userRole, requiredRoles, isPublic, contextName } = options;

    if (isPublic) {
      console.warn(
        `[RoleAuth] ⚠️ Se están usando @Roles y @PublicRoute juntos en ${contextName ?? 'handler'}. Se ignorará @PublicRoute`,
      );
      // Se sigue evaluando los roles
    }
    if (requiredRoles == null || requiredRoles.length === 0) {
      console.warn(
        `[RoleAuth] ⚠️ No roles definidos en @Roles() en ${contextName ?? 'handler'}`,
      );
      return true; // Sin roles -> acceso permitido si tienes token válido
    }
    // Si se pasaron múltiples roles, avisamos (pero permitimos)
    if (requiredRoles.length > 1) {
      console.warn(
        `[RoleAuth] ⚠️ Se han definido múltiples roles en @Roles() en ${contextName ?? 'handler'}: [${requiredRoles.join(', ')}]. Se tomará el de mayor nivel.`,
      );
    }
    if (!userRole) throw new ForbiddenException('No role found');

    const userLevel = RoleHierarchy[userRole];
    const allowedLevels = requiredRoles.map((role) => RoleHierarchy[role]);
    const minRequiredLevel = Math.min(...allowedLevels);

    const isAuthorized = userLevel <= minRequiredLevel;
    if (!isAuthorized)
      throw new ForbiddenException('Insufficient role privileges');

    return true;
  }
}
