import { createDomainError } from "src/domain/flows/error.registry";
import { ErrorCodes } from "src/domain/flows/error.type";
import { UserBase } from "src/domain/entities/user";


/**
 * User verification domain logic
 * Encapsulates business rules for email verification
 */
export class UserVerification {
  /**
   * Verifies a user's email with the provided token
   * Validates token match and expiration
   * 
   * @param user - User entity with verification token data
   * @param token - Verification token to validate
   * @returns Partial user object with updated verification fields
   * @throws {DomainError} If token is invalid or expired
   * 
   * @example
   * ```typescript
   * const updates = UserVerification.verify(user, token);
   * // returns { isVerified: true, verifyToken: undefined, verifyTokenExpire: undefined }
   * ```
   */
  static verify(user: UserBase, token: string): Partial<UserBase> {
    // Validate token match
    if (user.verifyToken !== token) {
      throw createDomainError(
        ErrorCodes.UNAUTHORIZED_ACTION,
        UserVerification,
        'verify',
        'tryAgainOrContact',
        {
          desc: {
            es: 'Error al validar el token de correo electrónico',
            en: 'Error at validate email token',
            ca: 'Error en validar el token de correu electrònic',
            de: 'Fehler beim Überprüfen des E-Mail-Tokens',
          },
        },
      );
    }

    // Validate token expiration
    if (
      user.verifyTokenExpire &&
      new Date(user.verifyTokenExpire) <= new Date()
    ) {
      throw createDomainError(
        ErrorCodes.UNAUTHORIZED_ACTION,
        UserVerification,
        'verify',
        'tryAgainOrContact',
        {
          shortDesc: 'Error with token time',
          desc: {
            es: 'El tiempo de verificación ha transcurrido',
            en: 'Verification time has elapsed',
            ca: 'El temps de verificació ha transcorregut',
            de: 'Die Überprüfungszeit ist abgelaufen',
          },
        },
      );
    }

    // Return updated verification fields
    return {
      isVerified: true,
      verifyToken: undefined,
      verifyTokenExpire: undefined,
    };
  }

  /**
   * Checks if a verification token is expired
   * 
   * @param expireDate - Token expiration date
   * @returns true if token is expired, false otherwise
   */
  static isTokenExpired(expireDate: Date | undefined): boolean {
    if (!expireDate) return false;
    return new Date(expireDate) <= new Date();
  }

  /**
   * Validates that a user has a verification token set
   * 
   * @param user - User entity to check
   * @returns true if user has verification token, false otherwise
   */
  static hasVerificationToken(user: UserBase): boolean {
    return !!user.verifyToken;
  }
}
