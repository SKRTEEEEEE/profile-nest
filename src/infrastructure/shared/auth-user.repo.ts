import { Injectable } from "@nestjs/common";
import { AuthUserRepository, JWTContext } from "src/application/interfaces/shared/auth-user.interface";
import { AuthUserService } from "src/application/usecases/shared/auth-user.service";

@Injectable()
// SIN USO ACTUALMENTE
// Debería extender si hay alguna parte que requiera configuración
export class AuthUserRepo implements AuthUserRepository {
 constructor (
    private readonly authUserService: AuthUserService
 ){}
 async verifyToken(token: string): Promise<(JWTContext | undefined) | null> {
     return this.authUserService.verifyToken(token)
 }
 async readFromToken(token: string): Promise<(JWTContext | undefined) | null> {
     return this.authUserService.readFromToken(token)
 }
}