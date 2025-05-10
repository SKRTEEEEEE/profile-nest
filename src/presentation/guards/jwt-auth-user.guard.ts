import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { PUBLIC_ROUTE_KEY } from "../decorators/public-route.decorator";

@Injectable()
export class JwtAuthUserGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Comprueba si la ruta está marcada como pública usando el decorador @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    
    // Si no es público, ejecuta la validación JWT estándar
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Puedes personalizar el manejo de errores aquí
    if (err || !user) {
      throw err || new UnauthorizedException('No estás autenticado');
    }
    return user;
  }
}