import { createDomainError, ERROR_CLASS_REGISTRY } from '@skrteeeeee/profile-domain';
import { ErrorCodes } from '@skrteeeeee/profile-domain';
import {
  DatabaseActionError,
  DatabaseFindError,
  SetEnvError,
  InputParseError,
  UnauthorizedError,
  NotImplementedError,
  SharedActionError,
  ThrottleError,
} from '@skrteeeeee/profile-domain';

describe('Error Registry', () => {
  class MockLocation {
    constructor() {}
  }

  const mockLocation = MockLocation;
  const mockFunction = 'testFunction';

  describe('ERROR_CLASS_REGISTRY', () => {
    it('should have all error codes mapped to their respective classes', () => {
      expect(ERROR_CLASS_REGISTRY[ErrorCodes.DATABASE_ACTION]).toBe(DatabaseActionError);
      expect(ERROR_CLASS_REGISTRY[ErrorCodes.DATABASE_FIND]).toBe(DatabaseFindError);
      expect(ERROR_CLASS_REGISTRY[ErrorCodes.INPUT_PARSE]).toBe(InputParseError);
      expect(ERROR_CLASS_REGISTRY[ErrorCodes.SET_ENV]).toBe(SetEnvError);
      expect(ERROR_CLASS_REGISTRY[ErrorCodes.THROTTLE]).toBe(ThrottleError);
      expect(ERROR_CLASS_REGISTRY[ErrorCodes.UNAUTHORIZED_ACTION]).toBe(UnauthorizedError);
      expect(ERROR_CLASS_REGISTRY[ErrorCodes.NOT_IMPLEMENTED]).toBe(NotImplementedError);
      expect(ERROR_CLASS_REGISTRY[ErrorCodes.SHARED_ACTION]).toBe(SharedActionError);
    });

    it('should have entries for all error codes', () => {
      const errorCodesValues = Object.values(ErrorCodes);
      const registryKeys = Object.keys(ERROR_CLASS_REGISTRY);
      
      expect(registryKeys).toHaveLength(errorCodesValues.length);
      errorCodesValues.forEach(code => {
        expect(ERROR_CLASS_REGISTRY[code]).toBeDefined();
      });
    });
  });

  describe('createDomainError', () => {
    it('should create correct error instance based on error code', () => {
      const error = createDomainError(ErrorCodes.DATABASE_ACTION, mockLocation, mockFunction);
      
      expect(error).toBeInstanceOf(DatabaseActionError);
      expect(error.type).toBe(ErrorCodes.DATABASE_ACTION);
    });

    it('should create error with custom friendly description', () => {
      const friendlyDesc = { es: 'Error personalizado', en: 'Custom error', ca: 'Error personalitzat', de: 'Benutzerdefinierter Fehler' };
      const error = createDomainError(ErrorCodes.INPUT_PARSE, mockLocation, mockFunction, friendlyDesc);
      
      expect(error.friendlyDesc).toEqual(friendlyDesc);
    });

    it('should create error with meta information', () => {
      const meta = { shortDesc: 'Test error', entity: 'User' };
      const error = createDomainError(ErrorCodes.DATABASE_FIND, mockLocation, mockFunction, undefined, meta);
      
      expect(error.meta).toEqual(meta);
    });

    it('should handle "tryAgainOrContact" predefined friendly description', () => {
      const error = createDomainError(ErrorCodes.THROTTLE, mockLocation, mockFunction, 'tryAgainOrContact');
      
      expect(error.friendlyDesc).toEqual({
        es: 'Inténtalo de nuevo más tarde o contáctanos si persiste',
        en: 'Try again after or contact us if persist',
        ca: "Torna-ho a provar més tard o contacta'ns si persisteix",
        de: 'Versuche es später erneut oder kontaktiere uns, falls das Problem weiterhin besteht',
      });
    });

    it('should handle "d" predefined friendly description with ups header', () => {
      const error = createDomainError(ErrorCodes.SET_ENV, mockLocation, mockFunction, 'd');
      
      expect(error.friendlyDesc).toEqual({
        es: 'Inténtalo de nuevo más tarde o contáctanos si persiste',
        en: 'Try again after or contact us if persist',
        ca: "Torna-ho a provar més tard o contacta'ns si persisteix",
        de: 'Versuche es später erneut oder kontaktiere uns, falls das Problem weiterhin besteht',
      });
      expect(error.meta?.desc).toEqual({
        es: 'Ups, ha ocurrido un error',
        en: 'Oops, an error occurred',
        ca: 'Ups, ha ocorregut un error',
        de: 'Ups, ein Fehler ist aufgetreten',
      });
    });

    it('should handle "credentials" predefined friendly description', () => {
      const error = createDomainError(ErrorCodes.UNAUTHORIZED_ACTION, mockLocation, mockFunction, 'credentials');
      
      expect(error.friendlyDesc).toEqual({
        es: 'Prueba de nuevo o recupera la contraseña si la has olvidado',
        en: 'Try again or recover your password if you forgot it',
        ca: "Torna-ho a provar o recupera la contrasenya si l'has oblidada",
        de: 'Versuche es erneut oder setze dein Passwort zurück, falls du es vergessen hast',
      });
      expect(error.meta?.desc).toEqual({
        es: 'Credenciales inválidas',
        en: 'Invalid credentials',
        ca: 'Credencials invàlides',
        de: 'Ungültige Anmeldedaten',
      });
    });

    it('should handle "credentials--mock" predefined friendly description', () => {
      const error = createDomainError(ErrorCodes.UNAUTHORIZED_ACTION, mockLocation, mockFunction, 'credentials--mock');
      
      expect(error.friendlyDesc).toEqual({
        es: 'La autenticación simulada falló',
        en: 'Mock authentication failed',
        ca: "L'autenticació simulada ha fallat",
        de: 'Die simulierte Authentifizierung ist fehlgeschlagen',
      });
    });

    it('should handle "ups" friendly header', () => {
      const customFriendlyDesc = { es: 'Descripción personalizada', en: 'Custom description', ca: 'Descripció personalitzada', de: 'Benutzerdefinierte Beschreibung' };
      const error = createDomainError(
        ErrorCodes.SHARED_ACTION,
        mockLocation,
        mockFunction,
        customFriendlyDesc,
        undefined,
        'ups'
      );
      
      expect(error.friendlyDesc).toEqual(customFriendlyDesc);
      expect(error.meta?.desc).toEqual({
        es: 'Ups, ha ocurrido un error',
        en: 'Oops, an error occurred',
        ca: 'Ups, ha ocorregut un error',
        de: 'Ups, ein Fehler ist aufgetreten',
      });
    });

    it('should create error for each error code type', () => {
      const testCases = [
        { code: ErrorCodes.DATABASE_ACTION, expectedClass: DatabaseActionError },
        { code: ErrorCodes.DATABASE_FIND, expectedClass: DatabaseFindError },
        { code: ErrorCodes.INPUT_PARSE, expectedClass: InputParseError },
        { code: ErrorCodes.SET_ENV, expectedClass: SetEnvError },
        { code: ErrorCodes.THROTTLE, expectedClass: ThrottleError },
        { code: ErrorCodes.UNAUTHORIZED_ACTION, expectedClass: UnauthorizedError },
        { code: ErrorCodes.NOT_IMPLEMENTED, expectedClass: NotImplementedError },
        { code: ErrorCodes.SHARED_ACTION, expectedClass: SharedActionError },
      ];

      testCases.forEach(({ code, expectedClass }) => {
        const error = createDomainError(code, mockLocation, mockFunction);
        expect(error).toBeInstanceOf(expectedClass);
        expect(error.type).toBe(code);
      });
    });
  });
});
