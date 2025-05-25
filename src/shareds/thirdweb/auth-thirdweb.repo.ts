import { Injectable } from "@nestjs/common";
import { VerifyJWTRes } from "../jwt-auth/application/jwt-auth.interface";
import { UnauthorizedError } from "src/domain/flows/domain.error";
import { createThirdwebClient, ThirdwebClient } from 'thirdweb';
import { createAuth, VerifyLoginPayloadParams } from 'thirdweb/auth';
import { Account, privateKeyToAccount } from 'thirdweb/wallets';
import { AuthThirdWebVerifyPayloadDto } from "./auth-thirdweb.dto";

@Injectable()
// TESTING
/* Este capa - ( /infra/shared) tiene sentido si:
- Debemos instanciar cierta logica que no depende de la presentacion(framework) la cual luego utilizaremos en la capa de presentación
- Vamos a utilizar sus metodos en algun punto de algun otro metodo.
    Por ejemplo, si hacemos un Thirdweb

*/
export class AuthThirdwebRepo {
  private client: ThirdwebClient;
  private account: Account;
  private auth: Record<string, Function>;

  constructor() {
    this.client = createThirdwebClient({
      clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
    });

    this.account = privateKeyToAccount({
      client: this.client,
      privateKey: process.env.THIRDWEB_ADMIN_PRIVATE_KEY! as `0x${string}`,
    });

    this.auth = createAuth({
      domain: process.env.THIRDWEB_AUTH_DOMAIN || 'http://localhost:3000',
      adminAccount: this.account,
    });
  }

  async verifyJWT(token: string): Promise<VerifyJWTRes> {
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    try {
      const res = await this.auth.verifyJWT({ jwt: token });
      if (!res.valid) throw new UnauthorizedError("No valid token");
      return res;
    } catch (error) {
      console.error("Error at VerifyJWT");
      throw error;
    }
  }

  async verifyPayload(params: AuthThirdWebVerifyPayloadDto) {
    const res = await this.auth.verifyPayload(params);
    return res;
  }
}