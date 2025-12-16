import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthThirdWebRepo } from 'src/shareds/thirdweb/auth-thirdweb.repo';
import { Reflector } from '@nestjs/core';
import { createDomainError } from '@skrteeeeee/profile-domain/dist/flows/error.registry';
import { ErrorCodes } from '@skrteeeeee/profile-domain/dist/flows/error.type';

@Injectable()
export class SignatureAuthThirdWebGuard implements CanActivate {
  constructor(
    private readonly authThirdWebRepository: AuthThirdWebRepo,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (process.env.JWT_STRATEGY === 'mock') {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // Leer el payload firmado desde el header
    const signedPayload = request.headers['x-signed-payload'];
    if (!signedPayload) {
      throw createDomainError(
        ErrorCodes.UNAUTHORIZED_ACTION,
        SignatureAuthThirdWebGuard,
        'canActivate',
        {
          en: 'Missing signed payload header',
          es: 'Falta la cabecera del payload firmado',
          ca: 'Falta la capçalera del payload signat',
          de: 'Signierter Payload-Header fehlt',
        },
      );
    }

    let parsedPayload;
    try {
      parsedPayload = JSON.parse(signedPayload);
    } catch {
      throw createDomainError(
        ErrorCodes.UNAUTHORIZED_ACTION,
        SignatureAuthThirdWebGuard,
        'canActivate',
        {
          en: 'Invalid signed payload format',
          es: 'Formato de payload firmado inválido',
          ca: 'Format de payload signat invàlid',
          de: 'Ungültiges Format des signierten Payloads',
        },
      );
    }

    const verified =
      await this.authThirdWebRepository.verifyPayload(parsedPayload);
    if (!verified.valid) {
      throw createDomainError(
        ErrorCodes.UNAUTHORIZED_ACTION,
        SignatureAuthThirdWebGuard,
        'canActivate',
        {
          en: 'Try again or recuperate your password if you forget',
          es: 'Inténtalo de nuevo o recupera tu contraseña si la olvidaste',
          ca: 'Torna-ho a provar o recupera la teva contrasenya si l’has oblidada',
          de: 'Versuche es erneut oder setze dein Passwort zurück, falls du es vergessen hast',
        },
        {
          desc: {
            en: 'Invalid credentials.',
            es: 'Credenciales inválidas.',
            ca: 'Credencials invàlides. ',
            de: 'Ungültige Anmeldedaten. ',
          },
        },
      );
    }

    request.verifiedPayload = verified;
    return true;
  }
}
