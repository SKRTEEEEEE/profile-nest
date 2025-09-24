import { Injectable } from '@nestjs/common';
import { VerifyJWTRes } from '../jwt-auth/application/jwt-auth.interface';
import { createDomainError } from 'src/domain/flows/error.registry';
import { ErrorCodes } from 'src/domain/flows/error.type';
import { createThirdwebClient, ThirdwebClient } from 'thirdweb';
import { createAuth, VerifyLoginPayloadParams } from 'thirdweb/auth';
import { Account, privateKeyToAccount } from 'thirdweb/wallets';
import { AuthThirdWebVerifyPayloadDto } from './auth-thirdweb.dto';

@Injectable()
// TESTING
/* Este capa - ( /infra/shared) tiene sentido si:
- Debemos instanciar cierta logica que no depende de la presentacion(framework) la cual luego utilizaremos en la capa de presentación
- Vamos a utilizar sus metodos en algun punto de algun otro metodo.
    Por ejemplo, si hacemos un Thirdweb

*/
export class AuthThirdWebRepo {
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
      throw createDomainError(
        ErrorCodes.UNAUTHORIZED_ACTION,
        AuthThirdWebRepo,
        'verifyJWT',
        undefined,
        { shortDesc: 'No token provided' },
      );
    }

    try {
      const res = await this.auth.verifyJWT({ jwt: token });
      if (!res.valid)
        throw createDomainError(
          ErrorCodes.UNAUTHORIZED_ACTION,
          AuthThirdWebRepo,
          'verifyJWT',
          'credentials',
        );
      return res;
    } catch (error) {
      throw createDomainError(
        ErrorCodes.UNAUTHORIZED_ACTION,
        AuthThirdWebRepo,
        'verifyJWT',
        'credentials',
      );
    }
  }

  async verifyPayload(params: AuthThirdWebVerifyPayloadDto) {
    const res = await this.auth.verifyPayload(params);
    return res;
  }
}
