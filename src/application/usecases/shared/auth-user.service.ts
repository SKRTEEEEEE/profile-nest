import { Injectable } from "@nestjs/common";
import { AuthUserRepository } from "src/application/interfaces/shared/auth-user.interface";



//No utilizar si no necesitamos -> Verificar tokens fuera de contexto HTTP - o - Abstracción para infraestructura de auth(websockets, workers, subscribers--mqtt)
@Injectable()
export class AuthUserService
// <TDBBase extends TDBBaseMockup>
{
    constructor(
        private readonly authUserRepository: AuthUserRepository
    ){}
    async verifyToken(token:string){
        return this.authUserRepository.verifyToken(token)
    }
    async readFromToken(token:string){
        return this.authUserRepository.readFromToken(token)
    }
}