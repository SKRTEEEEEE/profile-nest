## v3 working
### module
```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { Reflector } from '@nestjs/core';
import { ThirdwebAuthUserGuard } from '../guards/thirdweb-auth-user.guard';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'AUTH_GUARD',
      useClass: ThirdwebAuthUserGuard,
    },
    Reflector,
  ],
  exports: ['AUTH_GUARD'],
})
export class JwtAuthUserModule {}

```
### no/without strategy
### guard
```ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { createAuth } from "thirdweb/auth";
import { createThirdwebClient } from 'thirdweb';
import { privateKeyToAccount } from "thirdweb/wallets";


@Injectable()
export class ThirdwebAuthUserGuard extends AuthGuard('thirdweb') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      const client = createThirdwebClient({clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!})
      const account = privateKeyToAccount({client, privateKey: process.env.THIRDWEB_ADMIN_PRIVATE_KEY!});
      
      const auth = createAuth({
        domain: 'http://localhost:3000', // reemplaza con tu dominio
        adminAccount: account
      });

      const payload = await auth.verifyJWT({jwt: token});

      // Inyecta el usuario en el request para acceder desde el controller
      request.user = payload;
      return true;
    } catch (err) {
      console.error('Auth error:', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```
## v for basic
```ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
// import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";
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
    async validate(req:Request, payload: AuthUserJWTPayload){
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
```

## v for 'secp256k1'

```ts
// JwtAuthUserStrategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import { Strategy } from 'passport';
import { ethers } from 'ethers';
import { AuthUserJWTPayload } from 'src/application/interfaces/shared/auth-user.interface';

class CustomJwtStrategy extends Strategy {
  constructor(private configService: ConfigService) {
    super();
    this.name = 'jwt';
  }

  authenticate(req: Request, options?: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      return this.fail(new UnauthorizedException('No token provided'), 401);
    }

    try {
      const payload = this.verifyToken(token);
      return this.success(payload);
    } catch (error) {
      return this.fail(new UnauthorizedException(error.message), 401);
    }
  }

  private verifyToken(token: string): AuthUserJWTPayload {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    if (!headerB64 || !payloadB64 || !signatureB64) {
      throw new Error('Invalid JWT format');
    }

    const header = JSON.parse(Buffer.from(headerB64, 'base64').toString('utf8'));
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));

    if (header.alg !== 'ES256') {
      throw new Error('Invalid algorithm: ES256 required');
    }

    const publicKeyPem = this.configService.get<string>('JWT_PUBLIC_KEY');
    if (!publicKeyPem) {
      throw new Error('Public key not configured');
    }

    const signatureBuffer = Buffer.from(signatureB64, 'base64');
    console.log('Firma (bytes):', signatureBuffer.length);
    console.log('Firma (hex):', signatureBuffer.toString('hex'));

    // Tomar los últimos 64 bytes para r y s
    const compactSignature = signatureBuffer.slice(-64);
    const compactSignatureHex = compactSignature.toString('hex');
    console.log('Firma compacta (hex):', compactSignatureHex);
    console.log('Longitud compacta (bytes):', compactSignature.length);

    const message = `${headerB64}.${payloadB64}`;
    const messageHash = ethers.keccak256(ethers.toUtf8Bytes(message));
    const messageHashBuffer = Buffer.from(messageHash.slice(2), 'hex');

    let recoveredAddress: string | null = null;
    for (const v of [27, 28]) {
      try {
        const signatureWithV = `0x${compactSignatureHex}${v.toString(16).padStart(2, '0')}`;
        const address = ethers.recoverAddress(messageHashBuffer, signatureWithV);
        if (address.toLowerCase() === payload.iss.toLowerCase()) {
          recoveredAddress = address;
          break;
        }
      } catch (error) {
        console.log(`Error con v=${v}:`, error.message);
      }
    }

    if (!recoveredAddress) {
      throw new Error('Invalid signature: could not recover address');
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      throw new Error('Token expired');
    }
    if (payload.nbf && now < payload.nbf) {
      throw new Error('Token not yet valid');
    }

    return payload;
  }
}

@Injectable()
export class JwtAuthUserStrategy extends PassportStrategy(CustomJwtStrategy, 'jwt') {
  constructor(configService: ConfigService) {
    super( configService );
  }

  async validate(req: Request, payload: AuthUserJWTPayload) {
    console.log('validating..');
    const rawJwt = req.headers.authorization?.replace('Bearer ', '');
    console.log('Token JWT crudo:', rawJwt);
    console.log('Payload decodificado:', payload);

    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token JWT inválido');
    }

    return payload.ctx;
  }
}
```