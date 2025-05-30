import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtAuthInterface, VerifyJWTRes } from "src/shareds/jwt-auth/application/jwt-auth.interface";
import { AuthThirdWebRepo } from "src/shareds/thirdweb/auth-thirdweb.repo";


@Injectable()
// TESTING
/* Este capa - ( /infra/shared) tiene sentido si:
- Debemos instanciar cierta logica que no depende de la presentacion(framework) la cual luego utilizaremos en la capa de presentación
- Vamos a utilizar sus metodos en algun punto de algun otro metodo.
    Por ejemplo, si hacemos un Thirdweb

*/
export class JwtAuthThirdwebRepo implements JwtAuthInterface {
  constructor (
    private readonly authThirdwebRepo: AuthThirdWebRepo
  ){}
 async verifyJWT(token: string){
  return this.authThirdwebRepo.verifyJWT(token)
}
}