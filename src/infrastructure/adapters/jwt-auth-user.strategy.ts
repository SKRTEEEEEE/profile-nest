import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthUserJWTPayload } from "src/application/interfaces/shared/auth-user.interface";
// import { AuthUserService } from "src/application/usecases/shared/auth-user.service";

@Injectable()
export class JwtAuthUserStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        // private authUserService: AuthUserService // -> creo que no hace falta ya que se hace por inyeccion ❓
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // Para el otro algoritmo
            // secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
            // Si Thirdweb usa RS256, usarías esto en lugar de secretOrKey:
            secretOrKeyProvider: (request, rawJwtToken, done) => {
                const publicKey = this.configService.get<string>('JWT_PUBLIC_KEY');
                done(null, publicKey);
            },
        })
    }
    async validate(payload: AuthUserJWTPayload){
        if(!payload || !payload.sub)throw new UnauthorizedException("Token JWT inválido")

        // Aquí puedes buscar el usuario en tu base de datos usando la dirección
    // y añadir lógica adicional según tus requisitos
    // const user = await this.usersService.findByWalletAddress(payload.address);
    
    // if (!user) {
    //   // También puedes decidir si quieres crear el usuario automáticamente
    //   // o rechazar el token si el usuario no existe en tu base de datos
    //   throw new UnauthorizedException('Usuario no encontrado');
      
    //   // Alternativamente, podrías crear el usuario automáticamente:
    //   // return await this.usersService.createUser({
    //   //   walletAddress: payload.address,
    //   //   role: payload.role || 'user',
    //   // });
    // }
    
    return payload.ctx
    }
}