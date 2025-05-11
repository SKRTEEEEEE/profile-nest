// type JWTPayload<Tctx = unknown> = {
//     iss: string;
//     sub: string;
//     aud: string;
//     exp: number;
//     nbf: number;
//     iat: number;
//     jti: string;
//     ctx?: Tctx;
// }
// export type JWTContext<TDBBase extends TDBBaseMockup> = {
//     role: RoleType | null;
//     nick: string | undefined;
//     id: TDBBase["id"]; 
//     img: string | undefined;

import { RoleType } from "src/domain/entities/role.type";

//   }

// export type AuthUserJWTPayload<TDBBase extends TDBBaseMockup> = JWTPayload<JWTContext<TDBBase>>
// type AuthUser<TDBBase extends TDBBaseMockup> = AuthUserJWTPayload<TDBBase>["ctx"]

// //Tiene sentido pasar esta parte de arriba a domain ⬆️⬆️ -- cuando tenga clara la estructura de domain, y este mas avanzada la app pasar



// export abstract class AuthUserRepository
// <TDBBase extends TDBBaseMockup> {
//   abstract verifyToken(token:string): Promise<AuthUser<TDBBase> | null>
//   abstract readFromToken(token: string): Promise<AuthUser<TDBBase> | null>
// } 
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

export type AuthUserJWTPayload = JWTPayload<JWTContext>
type AuthUser = AuthUserJWTPayload["ctx"]

//Tiene sentido pasar esta parte de arriba a domain ⬆️⬆️ -- cuando tenga clara la estructura de domain, y este mas avanzada la app pasar



export abstract class AuthUserRepository {
abstract verifyToken(token:string): Promise<AuthUser | null>
abstract readFromToken(token: string): Promise<AuthUser | null>
} 
