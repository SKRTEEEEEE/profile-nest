import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtAuthInterface, VerifyJWTRes } from "src/shareds/jwt-auth/application/jwt-auth.interface";
import { createThirdwebClient } from 'thirdweb';
import { createAuth } from 'thirdweb/auth';
import { privateKeyToAccount } from 'thirdweb/wallets';

@Injectable()
// TESTING
/* Este capa - ( /infra/shared) tiene sentido si:
- Debemos instanciar cierta logica que no depende de la presentacion(framework) la cual luego utilizaremos en la capa de presentación
- Vamos a utilizar sus metodos en algun punto de algun otro metodo.
    Por ejemplo, si hacemos un Thirdweb

*/
export class JwtAuthThirdwebRepo implements JwtAuthInterface {
 async verifyJWT(token: string): VerifyJWTRes {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const client = createThirdwebClient({
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
      });

      const account = privateKeyToAccount({
        client,
        privateKey: process.env.THIRDWEB_ADMIN_PRIVATE_KEY! as `0x${string}`,
      });

      const auth = createAuth({
        domain: process.env.THIRDWEB_AUTH_DOMAIN || 'http://localhost:3000',
        adminAccount: account,
      });

        const res = await auth.verifyJWT({ jwt: token }) ;
        if(!res.valid)throw new UnauthorizedException("Token no valid")
        return res
    
    
 }catch (error){
    console.error("Error at VerifyJWT")
 }
}
}