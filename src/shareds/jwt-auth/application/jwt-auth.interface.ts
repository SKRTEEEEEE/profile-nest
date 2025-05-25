
import { RoleType } from "src/domain/entities/role.type";

type JWTPayload<Tctx = unknown> = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  ctx?: Tctx;
}
export type JWTContext = {
  role: RoleType | null;
  nick?: string | undefined;
  id: string; 
  img?: string | undefined;

}
export type VerifyJWTRes = Promise<{
  valid: boolean
  parsedJWT: JWTPayload
}|null| undefined>
export type UserAuthJWTPayload = JWTPayload<JWTContext>


//Tiene sentido pasar esta parte de arriba a domain ⬆️⬆️ -- cuando tenga clara la estructura de domain, y este mas avanzada la app pasar


// TESTING
export abstract class JwtAuthInterface {
abstract verifyJWT(token:string): VerifyJWTRes
} 
