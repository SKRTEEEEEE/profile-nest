import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { PUBLIC_ROUTE_KEY } from "./public-route.decorator";
import { Observable } from "rxjs";
import { RoleType } from "src/domain/entities/role.type";
import { ROLES_KEY } from "../../role-auth/presentation/role.decorator";
import { UnauthorizedError } from "src/domain/flows/domain.error";

// TODO - hacer que cuando se le pase isPublic y tambien requiredRoles, se anule el public!

@Injectable()
export class JwtAuthThirdwebGuard extends AuthGuard('thirdweb') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
    if(requiredRoles && isPublic){
      console.warn(`[UserAuth] ⚠️ Se están usando @Roles y @PublicRoute juntos en ${context.getClass().name + "." + context.getHandler().name}. Se ignorará @PublicRoute`)
      return super.canActivate(context)}
    else if (isPublic) {
      return true;
    }else return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedError(JwtAuthThirdwebGuard,"Error at handle request in jwt");
    }
    return user;
  }
}
