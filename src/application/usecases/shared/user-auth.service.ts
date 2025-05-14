import { Injectable } from "@nestjs/common";
import { UserAuthRepository } from "src/application/interfaces/shared/user-auth.interface";


// ⚠️ TESTING
//No utilizar si no necesitamos -> Verificar tokens fuera de contexto HTTP - o - Abstracción para infraestructura de auth(websockets, workers, subscribers--mqtt)
@Injectable()
export class UserAuthService
// <TDBBase extends TDBBaseMockup>
{
    constructor(
        private readonly userAuthRepository: UserAuthRepository
    ){}
    async verifyJWT(token:string){
        return this.userAuthRepository.verifyJWT(token)
    }
}