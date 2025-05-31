import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
// import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
import { JwtAuthPayload } from "src/shareds/jwt-auth/application/jwt-auth.interface";
// import { AuthUserService } from "src/application/usecases/shareds/auth-user.service";

// --> NOT USED - para usar se ha de crear el guard correspondiente

@Injectable()
export class JwtAuthNativeStrategy extends PassportStrategy(Strategy) {
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
                const publicKey = this.configService.get<string>("JWT_PUBLIC_KEY");
                console.log("pubKey: ",publicKey)
                done(null, publicKey);
            },
            verifyOptions: {
                algorithms: ["ES256"]
            },
            // secretOrKey: configService.get<string>("JWT_PUBLIC_KEY"),
            passReqToCallback: true,
        }as StrategyOptionsWithRequest)
    }
    async validate(req:Request, payload: JwtAuthPayload){
        console.log("validating..")
        // Acceder al token JWT crudo
        const rawJwt = req.headers.authorization?.replace('Bearer ', '');
        console.log('Token JWT crudo:', rawJwt);
        console.log('Payload decodificado:', payload);
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